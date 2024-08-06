const fs = require('fs');
const express = require('express');
const mem = require('memory-cache');
const mongoose = require('mongoose');

// Module Imports
const limiter = require('./rateLimit'); // Import the limiter
const loggerObj = require('./logFunc');

//Model imports
const Blog = require('./models/blogs.model');
const { error } = require('console');

// Configuration
const app = express();
const port = 3000;
const uri = "mongodb+srv://nithinsaikrishna98:bR0MxVkAz2PgkByi@mernproject.azanslx.mongodb.net/?retryWrites=true&w=majority&appName=mernProject"

// Use the limiter middleware for all routes
app.use(limiter);
app.use(express.json());

// mongoose connection

async function main() {
    await mongoose.connect(uri);
    await  console.log('Connected to MongoDB');

};

main().catch(err=>loggerObj.error(err));


// CRUD
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});


app.get('/blogs',async(req,res)=>{
    const blogs =await Blog.find({});
    res.status(200).json(blogs)
})

app.post('/blogs',async(req,res)=>{
    try{
        const { title, slug, author, comments, content, isActive } = req.body;
        if (!title || !slug || !author || !content) {
            loggerObj.warning("Fields Missing at POST /blogs")
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const blog_create = new Blog( { 
                title,
                slug,
                author,
                comments,
                content,
                isActive
         });
         
         const saveBlog = await blog_create.save(); 
         
         return res.status(201).json(blog_create);
    }catch(err){
        loggerObj.error(`Debug the error -> ${err}`)
        res.status(500).json(`Error Adding Blog Post-\n ${err}`);
    }
    

})


app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});


