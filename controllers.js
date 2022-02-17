const res = require('express/lib/response')
const { fetchTopics, fetchArticleById, fetchUsers } = require('./models')

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const ArticleId = req.params.article_id
  fetchArticleById(ArticleId)
    .then((article) => {
      //        console.log(article[0])
      res.status(200).send(article[0])
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users)
    })
    .catch(next)
}
