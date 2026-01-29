const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

const User = sequelize.define('User', { username: DataTypes.STRING });
const Question = sequelize.define('Question', { title: DataTypes.STRING });
const Answer = sequelize.define('Answer', { content: DataTypes.TEXT });

async function inspect() {
    try {
        await sequelize.authenticate();
        console.log('Connection stable.');

        const users = await User.findAll();
        console.log(`\n--- USERS (${users.length}) ---`);
        users.forEach(u => console.log(`ID: ${u.id}, Name: ${u.username}`));

        const questions = await Question.findAll();
        console.log(`\n--- QUESTIONS (${questions.length}) ---`);
        questions.forEach(q => console.log(`ID: ${q.id}, Title: ${q.title}`));

        const answers = await Answer.findAll();
        console.log(`\n--- ANSWERS (${answers.length}) ---`);
        answers.forEach(a => console.log(`ID: ${a.id}, QuestionId: ${a.QuestionId}`));

    } catch (err) {
        console.error('Inspection failed:', err);
    } finally {
        await sequelize.close();
    }
}

inspect();
