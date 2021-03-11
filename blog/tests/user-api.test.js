const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('../utils/test_helper');
const bcrypt = require('bcrypt')
const app = require('../app');
const api = supertest(app);
const User = require('../models/users');

const initialUsers = [
    {
        username: 'ansarova',
        name: 'Anar Ansarova',
        password: 'password'
    }, {
        username: 'idrissov',
        name: 'Anar Idrissova',
        password: 'password'
    }
];

beforeEach(async() => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})

    await user.save()
});

describe('Get all users', () => {
    test('should return all users', async() => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });
});

describe('Create new user', () => {
    test('should add user', async() => {
        const newUser = {
            username: 'kirkorov',
            name: 'Phillip',
            password: 'password'
        };

        const createdUser = await api
            .post('/api/users')
            .send(newUser);

        expect(createdUser.body.name).toBe(newUser.name);
        expect(createdUser.body.username).toBe(newUser.username);
    });

    test('should not create user to db if it already exists', async() => {
        const newUser = {
            username: 'ansarova',
            name: 'Anar Ansaridze',
            password: 'password'
        };

        await api
            .post('/api/users')
            .send(newUser);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(initialUsers.length);
    });

    test('should not create user if username is not provided', async() => {
        const newUser = {
            name: 'Anar Ansarchuk',
            password: 'password'
        };

        const createdUser = await api
            .post('/api/users')
            .send(newUser);
        expect(createdUser.status).toBe(400);
        expect(createdUser.body.error).toBe('username is missing');
    });

    test('should not cteate user if password is not provided', async() => {
        const newUser = {
            username: 'ramusic',
            name: 'Emin Agalarov'
        };

        const createdUser = await api
            .post('/api/users')
            .send(newUser);
        expect(createdUser.status).toBe(400);
        expect(createdUser.body.error).toBe('password is missing');
    });

    test('should not create user if username has less than 3 characters', async() => {
        const newUser = {
            username: 'yo',
            name: 'terletskaya',
            password: 'password'
        };

        const createdUser = await api
            .post('/api/users')
            .send(newUser);

        expect(createdUser.status).toBe(400);
        expect(createdUser.body.error).toBe('username must be at least 3 characters long');
    });

    test('should not create password if password has less than 3 characters', async() => {
        const newUser = {
            username: 'yoyoyo',
            name: 'terletskaya luba',
            password: 'pa'
        };

        const createdUser = await api
            .post('/api/users')
            .send(newUser);

        expect(createdUser.status).toBe(400);
        expect(createdUser.body.error).toBe('password should be at least 3 character');
    });
});

afterAll(async() => {
    await mongoose
        .connection
        .close();
});
