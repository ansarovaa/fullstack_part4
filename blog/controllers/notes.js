const blogsRouter = require("express").Router();
const {response} = require("express");
const Blog = require("../models/blogs");

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({})
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
    if (!body.title || !body.url) {
        response
            .status(400)
            .end();
    } else {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0
        })
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
    }

});

blogsRouter.delete('/:id', async(request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response
        .status(204)
        .end()
})

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