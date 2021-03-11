const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.get('/', async(request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

usersRouter.post('/', async(request, response) => {
    const body = request.body

    if (!body.username) {
        response
            .status(400)
            .json({error: 'username is missing'});
        return;
    }

    if (!body.password) {
        response
            .status(400)
            .json({error: 'password is missing'});
        return;
    }

    if ((body.password.length < 4) && (body.password)) {
        return response
            .status(400)
            .json({error: 'password should be at least 3 character'})
    }

    if (body.username.length < 4) {
        response
            .status(400)
            .json({error: 'username must be at least 3 characters long'});
        return;
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({username: body.username, name: body.name, passwordHash})

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = usersRouter