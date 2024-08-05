const fs = require('fs');
const express = require('express');
const mem = require('memory-cache');
const limiter = require('./rateLimit'); // Import the limiter

const app = express();
const port = 3000;

// Use the limiter middleware for all routes
app.use(limiter);

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});