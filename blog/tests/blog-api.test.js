const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')
const bcrypt = require('bcrypt')
const User = require('../models/users')
const helper = require('../utils/test_helper')
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
    test('should return 204 in case of successfull deleting', async() => {
        await api
            .delete('/api/blogs/6045b1912121bb42b03d58ef')
            .expect(204)
    })
});

describe('PUT /blogs', function () {
    test('should update blog', async() => {
        const blogs = await api.get('/api/blogs');
        const id = blogs.body[0].id;

        const updatedBlogInfo = {
            title: 'Love',
            author: 'Chelsy',
            url: 'vk.com',
            likes: 27
        }
        const updatedBlog = await api
            .put(`/api/blogs/${id}`)
            .send(updatedBlogInfo)
            .set('Accept', 'application/json')
            .expect(200);

        expect(updatedBlog.body).toHaveProperty('likes', 27);
    })
})

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

describe('when there is initially one user in db', () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with a fresh username', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})

afterAll(() => {
    mongoose
        .connection
        .close()
})