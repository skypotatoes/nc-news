const express = require('express')
const app = express()

const {
  getTopics,
  patchVotesByArticleId,
  getArticleById,
  getCommentsByArticleId,
  getArticles,
  getUsers,

} = require('./controllers')

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getUsers)

app.patch('/api/articles/:article_id', patchVotesByArticleId)

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' })
})

app.all('/*', (req, res) => {

  res.status(404).send({ msg: 'Path not found' })
})

module.exports = app
