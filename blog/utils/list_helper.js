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

const mostBlogs = (blogs) => {
    const authors = blogs.map((blog) => blog.author)
    const countBlogs = authors.reduce((count, i) => {
        count[i]
            ? count[i]++
            : (count[i] = 1)
        return count
    }, {})
    const authorWithMostBlogs = Object
        .entries(countBlogs,)
        .reduce((a, b) => (countBlogs[a] > countBlogs[b]
            ? a
            : b))

    const topAuthor = {
        author: authorWithMostBlogs[0],
        blogs: authorWithMostBlogs[1]
    }
    return topAuthor
}

const mostLikes = (blogs) => {
    const authors = blogs.map((blog) => blog.author)
    const countLikes = authors.map((author) => {
        const blogsAuthor = blogs.filter((blog) => blog.author === author)
        const countLikesForOneAuthor = blogsAuthor.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
        const totalLikesAuthor = {
            author: author,
            likes: countLikesForOneAuthor
        }
        return totalLikesAuthor
    })
    return countLikes.reduce((a, b) => (a.likes > b.likes
        ? a
        : b))
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}