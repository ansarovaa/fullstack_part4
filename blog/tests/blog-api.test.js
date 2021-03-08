const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')
const initialBlogs = [
    {
        title: "My life",
        author: "Anar Ansarova",
        url: "www.vk.com",
        likes: 37373
    }, {
        title: "My life",
        author: "Serik Idrissov",
        url: "www.vk.com",
        likes: 373
    }
]
beforeEach(async() => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async() => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose
        .connection
        .close()
})