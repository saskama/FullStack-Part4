const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async(request, response, next) => {
  const users = await User
  .find({}).populate('blogs', { url: 1, title: 1 , author:1})

  response.json(users)
})

usersRouter.post('/', async(request, response, next) => {
    const body = request.body

    if (!body.password) {
      return response.status(404).send({ error: 'password missing'})
      }
    else if (body.password.length<3){
      return response.status(404).send({ error: 'password too short' }) 
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)


    const user = new User(
        {username: body.username,
         name: body.name,
         password: passwordHash
        })
    
    const savedUser = await user.save()
    response.json(savedUser)
 
  })
  

  module.exports = usersRouter