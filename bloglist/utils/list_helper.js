const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce(function(prev, current) {return prev + +current.likes}, 0)
  }

  const favoriteBlog = (blogs) => {

    return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog);

  }

  const mostBlogs = (blogs) => {

    let counts = {}

    for (const author of blogs.map(auth => auth.author)) {
        counts[author] = counts[author] ? counts[author] + 1 : 1;
      }

    let highest = Object.keys(counts)[0]

    for (key in counts) {
        
        highest = counts[key] > counts[highest] ? key : highest
    }
      
   return {author: highest,
            blogs: counts[highest]}
 }

  const mostLikes = (blogs) => {
    
    let likes = blogs.reduce((a,b)=> (a[b.author] = (a[b.author] || 0) + b.likes, a), {})

    let highest = Object.keys(likes)[0]

    for (key in likes) {
        highest = likes[key] > likes[highest] ? key : highest
    }

    return {author: highest,
    likes: likes[highest]}


  }


 
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }