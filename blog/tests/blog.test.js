const listHelper = require('../utils/list_helper')

const blogs = []

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful' +
            '.html',
        likes: 5,
        __v: 0
    }
]

const listBlog = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
    }, {
        title: 'My life',
        author: 'Ansarova Anar',
        likes: 2222000
    }, {
        title: 'My pain',
        author: 'Serik Idrissov',
        likes: 33
    }, {
        title: 'My gain',
        author: 'Serik Idrissov',
        likes: 33
    }
]

test('dummy returns one', () => {
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
})

describe('most liked blog', () => {
    const result = listHelper.favoriteBlog(listBlog)
    test('show the blog with most likes', () => {
        expect(result).toEqual({title: 'My life', author: 'Ansarova Anar', likes: 2222000})
    })
})

describe('author with max count of blogs', () => {
    const result = listHelper.mostBlogs(listBlog)
    test('show the author with most blogs', () => {
        expect(result).toEqual({author: 'Serik Idrissov', blogs: 2})
    })
})

describe('author with max count of likes', () => {
    const result = listHelper.mostLikes(listBlog)
    test('show the author with most likes', () => {
        expect(result).toEqual({author: 'Ansarova Anar', likes: 2222000})
    })
})
