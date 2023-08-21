// Import the MySQL module
const sql = require('mysql2');

// Create a connection to the MySQL database
const con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'raghu',
    database: 'nodejs_db'
});

// Function to fetch mobile data from the mobiles table
function getMobiles() {
    return new Promise(function (resolve, reject) {
        con.query(
            `
            SELECT * FROM mobiles
            `,
            function (err, rows, col) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Function to add a new mobile entry into the mobiles table
function addMobile(name, price, ram, storage) {
    return new Promise(function (resolve, reject) {
        con.query(
            `
            INSERT INTO mobiles (name, price, ram, storage) VALUES (?, ?, ?, ?)
            `,
            [name, price, ram, storage],
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            }
        );
    });
}

// Function to update mobile data in the mobiles table
function updateMobile(id, name, price, ram, storage) {
    return new Promise(function (resolve, reject) {
        con.query(
            `
            UPDATE mobiles SET name = ?, price = ?, ram = ?, storage = ? WHERE id = ?
            `,
            [name, price, ram, storage, id],
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            }
        );
    });
}

// Function to delete a mobile entry from the mobiles table
function deleteMobile(id) {
    return new Promise(function (resolve, reject) {
        con.query(
            `
            DELETE FROM mobiles WHERE id = ?
            `,
            [id],
            function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            }
        );
    });
}

// Function to fetch a single mobile entry by its ID
function getMobileById(id) {
    return new Promise(function (resolve, reject) {
        con.query(
            `
            SELECT * FROM mobiles WHERE id = ?
            `,
            [id],
            function (err, rows, col) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            }
        );
    });
}

module.exports = {
    addMobile,
    getMobiles,
    deleteMobile,
    updateMobile,
    getMobileById,
    con
};
