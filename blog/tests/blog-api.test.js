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

let token
beforeEach(async() => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    await User.deleteMany({});
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('testPassword', saltRounds);
    const user = new User({username: 'monika', name: 'monika', passwordHash});

    await user.save();

    await api
        .post('/api/login')
        .send({username: 'monika', password: 'testPassword'})
        .then((response) => {
            token = response.body.token;
        });
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
        const blogToDelete = {
            title: "My life",
            author: "Anar Ansarova",
            url: "www.vk.com",
            likes: 3
        }
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(blogToDelete)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const blogDelete = response.body;

        await api
            .delete(`/api/blogs/${blogDelete.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204);
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
            .set('Authorization', `bearer ${token}`)
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
            .set('Authorization', `bearer ${token}`)
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
            .set('Authorization', `bearer ${token}`)
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
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

    })
})

afterAll(() => {
    mongoose
        .connection
        .close()
})