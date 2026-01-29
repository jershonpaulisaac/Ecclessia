const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.all("SELECT id, username, email FROM Users", (err, rows) => {
        console.log("\n--- USERS ---");
        console.log(JSON.stringify(rows, null, 2));
    });

    db.all("SELECT id, title, context, verse_ref FROM Questions", (err, rows) => {
        console.log("\n--- QUESTIONS ---");
        console.log(JSON.stringify(rows, null, 2));
    });

    db.all("SELECT id, scripture, reflection FROM QuietTimes", (err, rows) => {
        console.log("\n--- QUIET TIMES ---");
        console.log(JSON.stringify(rows, null, 2));
    });
});
