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

describe('GET /blogs', function () {
    test('blogs are returned as json', async() => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('blogs have parameter id', async() => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })

});

describe('POST /blogs', function () {
    test('a valid blog can be added', async() => {
        const newBlog = {

            title: "Visa",
            author: "Aziza",
            url: "vk.com",
            likes: 74
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response
            .body
            .map(r => r.title)

        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain('Visa')
    })
})

afterAll(() => {
    mongoose
        .connection
        .close()
})