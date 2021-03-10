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

describe('DELETE /blogs', function () {
    test('should return 204 in case of successfull deleting', async () => {
      await api.delete('/api/blogs/6045b1912121bb42b03d58ef').expect(204)
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
    test('an empty likes should be equal to 0 value', async() => {
        const newBlog = {

            title: "VEmpty likes",
            author: "Aziza Ansarova",
            url: "vk.com"
        }

        const blogList = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(blogList.body).toHaveProperty('likes', 0)
    })
    test('title missing should return 400 error', async() => {
        const newBlog = {
            author: "Aziza Ansarova",
            url: "vk.com",
            likes: 39393
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })
    test('url missing should return 400 error', async() => {
        const newBlog = {
            title: "testing",
            author: "Aziza Ansarova",
            likes: 39393
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

    })
})

afterAll(() => {
    mongoose
        .connection
        .close()
})