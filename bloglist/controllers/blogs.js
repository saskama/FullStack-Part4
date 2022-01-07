const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
  })

blogsRouter.post('/', async(request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user
    })

    const savedBlog = await blog.save()
    
    user.blogs = user.blogs.concat(savedBlog._id)

    const savedUser = await user.save()
    
    response.json(savedBlog)
   
  })

  blogsRouter.delete('/:id', async(request, response, next) => {
    const body = request.body
  
    if (!request.token){
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }


    const user = await User.findById(decodedToken.id).catch(error => next(error))
    const blog = await Blog.findById(request.params.id).catch(error => next(error))

    if (!blog){
      return response.status(401).json({ error: 'Blog cannot be found' })
    }
    else if (!user){
      return response.status(401).json({ error: 'Blog cannot be found' })
    } 

    if ( blog.user.toString() === user.id.toString() ) {
        Blog.findByIdAndRemove(request.params.id)
          .then(result => {
            response.status(204).end()
          })
          .catch(error => next(error))

          const blogs_list = user.blogs.filter(item => item !== request.params.id)

          user.blogs = blogs_list

        }
        
  })


  module.exports = blogsRouter