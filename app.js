const express = require('express')
const app = express()
const { getTopics, getArticleById, getUsers } = require('./controllers')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/users', getUsers)

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' })
})

module.exports = app
