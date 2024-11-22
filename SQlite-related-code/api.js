// Import the necessary modules
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the updated db.js which connects to SQLite
const app = express();

// Middleware for handling Cross-Origin Requests and JSON body parsing
app.use(cors());
app.use(express.json());

// Set the port to the one provided in command line or environment variable, otherwise use 5500 as default
const port = process.argv[2] || process.env.PORT || 5500;

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server started at port No: ${port}`);
});

// Route to get all mobile entries
app.get('/mobiles', (req, res) => {
    db.getMobiles()
        .then((mobiles) => {
            res.json(mobiles);  // Respond with the list of mobiles
        })
        .catch((error) => {
            console.error("Error:", error);  // Log the error
            res.status(500).json({ error: "An error occurred while fetching mobiles." });  // Respond with error message
        });
});

// Route to get a single mobile entry by its ID
app.get('/mobiles/:id', (req, res) => {
    const { id } = req.params;  // Get mobile ID from request parameters
    db.getMobileById(id)
        .then((mobile) => {
            if (mobile) {
                res.json(mobile);  // If mobile is found, return it as JSON
            } else {
                res.status(404).json({ message: "Mobile not found" });  // If mobile not found, return 404
            }
        })
        .catch((error) => {
            console.error("Error:", error);  // Log the error
            res.status(500).json({ error: "An error occurred while fetching the mobile." });  // Return server error
        });
});

// Route to add a new mobile entry
app.post('/mobiles', (req, res) => {
    const { name, price, ram, storage } = req.body;  // Get data from the request body
    db.addMobile(name, price, ram, storage)
        .then((result) => {
            res.json({ message: "Mobile added successfully", result: { name, price, ram, storage } });  // Respond with success
        })
        .catch((error) => {
            console.error("Error:", error);  // Log the error
            res.status(500).json({ error: "An error occurred while adding a mobile." });  // Respond with error message
        });
});

// Route to update an existing mobile entry by its ID
app.put('/mobiles/:id', (req, res) => {
    const { id } = req.params;  // Get mobile ID from request parameters
    const { name, price, ram, storage } = req.body;  // Get updated mobile data from the request body
    db.updateMobile(id, name, price, ram, storage)
        .then(() => {
            res.json({ message: "Mobile updated successfully", result: { name, price, ram, storage } });  // Respond with success
        })
        .catch((error) => {
            console.error("Error:", error);  // Log the error
            res.status(500).json({ error: "An error occurred while updating a mobile." });  // Return error message
        });
});

// Route to delete a mobile entry by its ID
app.delete('/mobiles/:id', (req, res) => {
    const { id } = req.params;  // Get mobile ID from request parameters
    db.deleteMobile(id)
        .then((result) => {
            if (result.affectedRows > 0) {
                res.json({ message: "Mobile deleted successfully" });  // If deletion is successful, respond with success
            } else {
                res.status(404).json({ message: "Mobile not found" });  // If no mobile was found to delete, return 404
            }
        })
        .catch((error) => {
            console.error("Error:", error);  // Log the error
            res.status(500).json({ error: "An error occurred while deleting a mobile." });  // Return error message
        });
});

// 1. Default command to execute the server:
// - If no port is specified, the server will automatically start on port 5500.
// - Command: `node api.js`
// Example: `node api.js` (This will run the server on port 5500 by default.)

// 2. Custom port command:
// - You can specify a custom port number at runtime by passing it as a command-line argument.
// - Command: `node api.js <port_number>`
// Example: `node api.js 6000` (This will run the server on port 6000.)

