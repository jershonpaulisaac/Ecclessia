const express = require('express');
const app = express();
const PORT = 4000;

app.delete('/api/questions/:id', (req, res) => {
    console.log(`Test Server: Received DELETE request for ID: ${req.params.id}`);
    res.json({ message: "Test Delete Successful", id: req.params.id });
});

app.listen(PORT, () => {
    console.log(`Test Server running on http://localhost:${PORT}`);
});
