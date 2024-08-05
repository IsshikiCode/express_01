const mongoose = require('mongoose');
const fs = require('fs');
const express = require('express');


const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    slug:{
        unique: true,
        type: String
    },
    author:{
        type: String,
        required: true
    },
    comments:{
        type: Array,
        required: false
    },
    content:{
        type: String,
        required: true
    },
    isActive:{
        type: Boolean,
        required:false
    }
    

},{timestamps: true})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;