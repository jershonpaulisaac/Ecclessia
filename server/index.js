const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Express App
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all for initial deployment simplicity
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Error handler for malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Malformed JSON received:', err.message);
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
});

// Global logger to debug routes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database Setup (SQLite for development)
// In production on Railway, SQLite will reset every deploy. 
// User should eventually add a Postgres service.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE_URL || path.join(__dirname, 'database.sqlite'),
    logging: false
});

// --- Models ---

// User Model
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING }, // Optional now (for legacy users)
    role: { type: DataTypes.STRING, defaultValue: 'member' },
    phone: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    intro: { type: DataTypes.TEXT },
    subscribedNewsletter: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Q&A Question Model
const Question = sequelize.define('Question', {
    title: { type: DataTypes.STRING, allowNull: false },
    context: { type: DataTypes.TEXT },
    verse_ref: { type: DataTypes.STRING },
    amen_count: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Q&A Answer Model
const Answer = sequelize.define('Answer', {
    content: { type: DataTypes.TEXT, allowNull: false },
    helpful_count: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Quiet Time Entry Model
const QuietTime = sequelize.define('QuietTime', {
    scripture: { type: DataTypes.STRING, allowNull: false },
    reflection: { type: DataTypes.TEXT, allowNull: false },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: false },
    reactions: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Prayer Request Model
const PrayerRequest = sequelize.define('PrayerRequest', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    request: { type: DataTypes.TEXT, allowNull: false }
});

// General Inquiry Model
const Inquiry = sequelize.define('Inquiry', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false }
});

// Contribution Record Model
const ContributionRecord = sequelize.define('ContributionRecord', {
    type: { type: DataTypes.STRING, allowNull: false }, // content, prayer, service, support
    amount: { type: DataTypes.STRING }, // For financial support
    message: { type: DataTypes.TEXT },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }
});

// Relationships
User.hasMany(Question); Question.belongsTo(User);
User.hasMany(Answer); Answer.belongsTo(User);
Question.hasMany(Answer); Answer.belongsTo(Question);
User.hasMany(QuietTime); QuietTime.belongsTo(User);
User.hasMany(PrayerRequest); PrayerRequest.belongsTo(User, { foreignKey: { allowNull: true } });
User.hasMany(Inquiry); Inquiry.belongsTo(User, { foreignKey: { allowNull: true } });
User.hasMany(ContributionRecord); ContributionRecord.belongsTo(User, { foreignKey: { allowNull: true } });

// --- Routes ---

// 0. Base Route for Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 1. Delete Question (Moved up)
app.delete('/api/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Backend: DELETE request for Question ID: ${id}`);

        // First delete associated answers
        const deletedAnswers = await Answer.destroy({ where: { QuestionId: id } });
        console.log(`Backend: Deleted ${deletedAnswers} associated answers`);

        // Then delete the question
        const deleted = await Question.destroy({ where: { id } });

        if (deleted) {
            console.log(`Backend: Question ${id} deleted successfully`);
            res.json({ message: "Question deleted successfully" });
        } else {
            console.warn(`Backend: Question ${id} not found`);
            res.status(404).json({ error: "Question not found" });
        }
    } catch (err) {
        console.error('Backend: Delete question error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Delete Quiet Time (Moved up)
app.delete('/api/quiet-times/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Backend: DELETE request for Quiet Time ID: ${id}`);
        const deleted = await QuietTime.destroy({ where: { id } });

        if (deleted) {
            res.json({ message: "Entry deleted successfully" });
        } else {
            res.status(404).json({ error: "Entry not found" });
        }
    } catch (err) {
        console.error('Backend: Delete quiet time error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 3. Get Questions
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: Answer, include: [User] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Post Question
app.post('/api/questions', async (req, res) => {
    try {
        // For demo, we hardcode a user. In fully functional app, use auth token.
        const user = await User.findOne();
        if (!user) return res.status(401).json({ error: "No users exist yet!" });

        const { title, context, verse_ref } = req.body;
        const newQ = await Question.create({
            title, context, verse_ref, UserId: user.id
        });
        res.json(newQ);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get Quiet Times
app.get('/api/quiet-times', async (req, res) => {
    try {
        const entries = await QuietTime.findAll({
            where: { is_public: true },
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Post Quiet Time
app.post('/api/quiet-times', async (req, res) => {
    try {
        const user = await User.findOne();
        const { scripture, reflection, is_public } = req.body;
        const entry = await QuietTime.create({
            scripture, reflection, is_public, UserId: user.id
        });
        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, phone, city, intro } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ error: "Email already registered. Please login instead." });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ error: "Username already taken. Please choose another." });
            }
        }

        // In prod, hash password here using bcrypt
        const user = await User.create({ username, email, password, phone, city, intro });
        res.json({
            message: "User registered!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                phone: user.phone,
                city: user.city,
                intro: user.intro
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).json({ error: err.message || "Registration failed" });
    }
});

// 6. Get All Users (Admin)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'createdAt']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Join Community (replaces register)
app.post('/api/join-community', async (req, res) => {
    try {
        const { name, email, phone, city, intro, subscribedNewsletter } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const user = await User.create({
            username: name,
            email,
            phone,
            city,
            intro,
            subscribedNewsletter: subscribedNewsletter || false
        });

        res.json({
            message: "Welcome to the community!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Join community error:', err);
        res.status(400).json({ error: err.message || "Failed to join" });
    }
});

// 8. Delete Question
app.delete('/api/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Backend: Attempting to delete question ID: ${id}`);

        // First delete associated answers
        const deletedAnswers = await Answer.destroy({ where: { QuestionId: id } });
        console.log(`Backend: Deleted ${deletedAnswers} associated answers`);

        // Then delete the question
        const deleted = await Question.destroy({ where: { id } });

        if (deleted) {
            console.log(`Backend: Question ${id} deleted successfully`);
            res.json({ message: "Question deleted successfully" });
        } else {
            console.warn(`Backend: Question ${id} not found`);
            res.status(404).json({ error: "Question not found" });
        }
    } catch (err) {
        console.error('Backend: Delete question error:', err);
        res.status(500).json({ error: err.message });
    }
});

// 9. Delete Quiet Time
app.delete('/api/quiet-times/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await QuietTime.destroy({ where: { id } });

        if (deleted) {
            res.json({ message: "Entry deleted successfully" });
        } else {
            res.status(404).json({ error: "Entry not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Prayer Requests
app.post('/api/prayer-requests', async (req, res) => {
    try {
        console.log('Incoming Prayer Request:', req.body);
        const { name, email, request } = req.body;
        const newReq = await PrayerRequest.create({ name, email, request });
        res.json(newReq);
    } catch (err) {
        console.error('Prayer Request Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/prayer-requests', async (req, res) => {
    try {
        const requests = await PrayerRequest.findAll({ order: [['createdAt', 'DESC']] });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/prayer-requests/:id', async (req, res) => {
    try {
        const deleted = await PrayerRequest.destroy({ where: { id: req.params.id } });
        res.json({ success: !!deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. Inquiries
app.post('/api/inquiries', async (req, res) => {
    try {
        console.log('Incoming Inquiry:', req.body);
        const { name, email, message } = req.body;
        const newInq = await Inquiry.create({ name, email, message });
        res.json(newInq);
    } catch (err) {
        console.error('Inquiry Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({ order: [['createdAt', 'DESC']] });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/inquiries/:id', async (req, res) => {
    try {
        const deleted = await Inquiry.destroy({ where: { id: req.params.id } });
        res.json({ success: !!deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 12. Contributions
app.post('/api/contributions', async (req, res) => {
    try {
        console.log('Incoming Contribution:', req.body);
        const { name, email, type, amount, message } = req.body;
        const newRecord = await ContributionRecord.create({ name, email, type, amount, message });
        res.json(newRecord);
    } catch (err) {
        console.error('Contribution Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/contributions', async (req, res) => {
    try {
        const records = await ContributionRecord.findAll({ order: [['createdAt', 'DESC']] });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/contributions/:id', async (req, res) => {
    try {
        const deleted = await ContributionRecord.destroy({ where: { id: req.params.id } });
        res.json({ success: !!deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Server Start ---
// Sync DB with alter: true to add new columns without deleting data
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced');

    // Create a default user if none exists
    const count = await User.count();
    if (count === 0) {
        await User.create({
            username: 'GraceWalker',
            email: 'grace@example.com',
            password: 'password123'
        });
        console.log('Default user created');
    }

    const FINAL_PORT = process.env.PORT || PORT;
    app.listen(FINAL_PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${FINAL_PORT}`);
        console.log(`API endpoints ready.`);
    });
});
