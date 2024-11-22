// Import the sqlite3 module
const sqlite3 = require('sqlite3').verbose();

// Create or open the SQLite database file
const db = new sqlite3.Database('./nodejs_db.sqlite3', (err) => {
    if (err) {
        console.error("Error opening SQLite database:", err);
    } else {
        console.log("Connected to the SQLite database.");
        // Ensure the tables are created automatically when the app starts
        createTables();
    }
});

// Function to create the tables if they don't exist
function createTables() {
    db.serialize(() => {
        // Create the 'mobiles' table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS mobiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                ram INTEGER NOT NULL,
                storage INTEGER NOT NULL
            );
        `, (err) => {
            if (err) {
                console.error("Error creating tables:", err);
            } else {
                console.log("Tables are set up or already exist.");
            }
        });
    });
}

// Function to fetch mobile data from the mobiles table
function getMobiles() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM mobiles', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Function to add a new mobile entry into the mobiles table
function addMobile(name, price, ram, storage) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO mobiles (name, price, ram, storage) VALUES (?, ?, ?, ?)',
            [name, price, ram, storage],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            }
        );
    });
}

// Function to update mobile data in the mobiles table
function updateMobile(id, name, price, ram, storage) {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE mobiles SET name = ?, price = ?, ram = ?, storage = ? WHERE id = ?',
            [name, price, ram, storage, id],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            }
        );
    });
}

// Function to delete a mobile entry from the mobiles table
function deleteMobile(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM mobiles WHERE id = ?', [id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ affectedRows: this.changes });
            }
        });
    });
}

// Function to fetch a single mobile entry by its ID
function getMobileById(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM mobiles WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Close the database connection when the app is closed
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error("Error closing SQLite database:", err);
        } else {
            console.log("Closed SQLite database.");
        }
    });
});

module.exports = {
    addMobile,
    getMobiles,
    deleteMobile,
    updateMobile,
    getMobileById
};
