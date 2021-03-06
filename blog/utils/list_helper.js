const dummy = (blogs) => {
    return 1
}

const totalLikes = (blog) => {
    let total = blog.reduce(function(sum, likes) {
        return sum + likes.likes
    }, 0)
    return total
}
  
  module.exports = {
    dummy,
    totalLikes
  }