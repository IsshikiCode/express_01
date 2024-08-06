const express = require('express');
const mongoose = require('mongoose');

const Blog = require('./models/blogs.model');
const limiter = require('./rateLimit');
const loggerObj = require('./logFunc');

const blogRouter = express.Router();

blogRouter.post('/blogs',limiter,async(req,res)=>{
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
    

});

blogRouter.get('/blogs',limiter,async(req,res)=>{
    const blogs =await Blog.find({});
    res.status(200).json(blogs)
})

// Soft delete 

blogRouter.delete('/blogs/:id', limiter, async(req,res)=>{
    try{
        console.log(req.path);
        const id = req.params["id"];
        console.log(`blog id is ${id}`);
        const blogDelete = await Blog.findByIdAndUpdate(id, {isActive:false});
        console.log(blogDelete);
        res.status(200).json(blogDelete)
    }catch(err){
        res.status(500).json({"message":"Error at Deleting"})
        console.error("Error at Delete",err);
    }
})


// Comments

blogRouter.route('/blogs/:id/comments').get(limiter,async(req,res)=>{
    const blogId = req.params["id"];
    const commentsData = await Blog.findById(blogId);
    res.status(200).json(commentsData.comments);
}).post(limiter,async(req,res)=>{
    try{
        const blogId = req.params["id"];
        const { data } = req.body;
        const ipaddress = req.ip;

        const userBlog = await Blog.findById(blogId);
        let numbering = await userBlog['comments'].length +1;
        userBlog.comments.push({ipaddress, data, numbering});
        const commentsPosted = await userBlog.save();
        res.status(201).json(commentsPosted);
    }catch(err){
        console.error("Error Found",err);
        loggerObj.error("Error Logged at Comments",err)
        res.status(500).json({message:"Error Adding Comment"});
    }
})

module.exports = blogRouter;