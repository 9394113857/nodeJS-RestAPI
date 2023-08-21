const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

app.use(cors());

app.use(express.json());

const port = process.argv[2] || process.env.PORT || 5500; // Use the provided port, environment variable, or default to 5500

app.listen(port, () => {
    console.log(`Server started at port No: ${port}`);
});

app.get('/mobiles', (req, res) => {
    db.getMobiles()
        .then((mobiles) => {
            res.json(mobiles);
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred while fetching mobiles." });
        });
});

app.get('/mobiles/:id', (req, res) => {
    const { id } = req.params;
    db.getMobileById(id)
        .then((mobile) => {
            if (mobile) {
                res.json(mobile);
            } else {
                res.status(404).json({ message: "Mobile not found" });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred while fetching the mobile." });
        });
});

app.post('/mobiles', (req, res) => {
    const { name, price, ram, storage } = req.body;
    db.addMobile(name, price, ram, storage)
        .then(() => {
            res.json({ message: "Mobile added successfully", result: { name, price, ram, storage } });
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred while adding a mobile." });
        });
});

app.put('/mobiles/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, ram, storage } = req.body;
    db.updateMobile(id, name, price, ram, storage)
        .then(() => {
            res.json({ message: "Mobile updated successfully", result: { name, price, ram, storage } });
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred while updating a mobile." });
        });
});

app.delete('/mobiles/:id', (req, res) => {
    const { id } = req.params;
    db.deleteMobile(id)
        .then((result) => {
            if (result.affectedRows > 0) {
                res.json({ message: "Mobile deleted successfully" });
            } else {
                res.status(404).json({ message: "Mobile not found" });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred while deleting a mobile." });
        });
});

// To run the server with a specific port (e.g., 6000):
// Open a terminal/command prompt and navigate to the directory containing api.js
// Run the following command, replacing 6000 with your desired port number:
// node api.js 6000

// Access the API endpoints in a web browser or using an HTTP client:
// Open a web browser or use an HTTP client to make requests to http://localhost:6000/mobiles and other defined routes

// To stop the server:
// Go back to the terminal/command prompt window where the server is running
// Press Ctrl + C

// To run the server with nodemon and a specific port (e.g., 6000):
// Open a terminal/command prompt and navigate to the directory containing api.js
// Run the following command, replacing 6000 with your desired port number:
// nodemon api.js 6000


