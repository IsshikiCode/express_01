// const fs = require('fs');
const express = require('express');
const mem = require('memory-cache');
const mongoose = require('mongoose');

// Module Imports
const limiter = require('./rateLimit'); // Import the limiter
const loggerObj = require('./logFunc');

//Model imports
const Blog = require('./models/blogs.model');
const { error } = require('console');
const blogRouter = require('./blogRouter');

// Configuration
const app = express();
const port = 3000;
const uri = "mongodb+srv://nithinsaikrishna98:bR0MxVkAz2PgkByi@mernproject.azanslx.mongodb.net/?retryWrites=true&w=majority&appName=mernProject"

// Use the limiter middleware for all routes
// app.use(limite);
app.use(express.json());

// mongoose connection

async function main() {
    await mongoose.connect(uri);
    await  console.log('Connected to MongoDB');

};

main().catch(err=>loggerObj.error(err));

app.use(blogRouter);

// CRUD
app.get('/', limiter, (req, res) => {
    res.status(200).send('Hello World!');
});







app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});


