const blogsRouter = require("express").Router();
const {response} = require("express");
const jwt = require('jsonwebtoken')
const Blog = require("../models/blogs");
const config = require('../utils/config');
const User = require('../models/users')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async(request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog.toJSON())
    } else {
        response
            .status(404)
            .end()
    }
})

blogsRouter.post("/", async(request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response
            .status(401)
            .json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)
  
    if (!body.title || !body.url) {
        response
            .status(400)
            .end();
    } else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
            user: user._id
        })
        const savedBlog = await blog.save()
        user.blogs = user
            .blogs
            .concat(savedBlog._id)
        await user.save()
        const toReturn = await Blog.findById(savedBlog.id)
        .populate('user', {
            username: 1,
            name: 1
        })
        response.json(toReturn.toJSON())
    }

});

blogsRouter.delete('/:id', async (request, response, next) => {
    const { token, params } = request;
    const { id } = params || {};
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' });
      }
      const blog = await Blog.findById(id);
    
      const isLoggedUser = blog.user.toString() === decodedToken.id;
  
      if (isLoggedUser) {
        await blog.remove();
        return response.status(204).end();
      } else {
        return response.status(403).json({ error: 'not authorized' }).end();
      }
    } catch (err) {
      next(err);
    }
  });

blogsRouter.put('/:id', async(request, response) => {
    const id = request.params.id;

    const blog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes
    };

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {new: true});

    if (updatedBlog) {
        response.json(updatedBlog.toJSON());
    } else {
        response
            .status(404)
            .end();
    }

})

module.exports = blogsRouter;