const express = require('express')
const app = express()

const {
  getTopics,
  patchVotesByArticleId,
  getArticleById,
  getCommentsByArticleId,
  getArticles,
  getUsers,
  postComment,
  deleteCommentById,
} = require('./controllers')

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getUsers)

app.patch('/api/articles/:article_id', patchVotesByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

app.delete('/api/comment/:comment_id', deleteCommentById)

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' })
})

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else if (err.code === '22P02' || err.code === '23502') {
    res.status(400).send({ msg: 'Bad request' })
  } else if (err.code === '23503') {
    res.status(404).send({ msg: 'Article not found' })
  }
})

module.exports = app
