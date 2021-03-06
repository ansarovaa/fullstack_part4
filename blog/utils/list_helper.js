const dummy = (blogs) => {
    return 1
}

const totalLikes = (blog) => {
    let total = blog.reduce(function (sum, likes) {
        return sum + likes.likes
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }

    const max = blogs.reduce((previous, next) => previous.likes > next.likes
        ? previous
        : next)

    const favouriteBlog = {
        title: max.title,
        author: max.author,
        likes: max.likes
    }
    return favouriteBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}