const express = require('express')
const app = express()
const {getTopics, patchVotesByArticleId} = require('./controllers')

app.use(express.json())

app.get('/api/topics', getTopics)

app.patch('/api/articles/:article_id', patchVotesByArticleId)

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Path not found' });
  });


module.exports = app;