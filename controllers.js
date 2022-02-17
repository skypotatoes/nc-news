const {
  fetchTopics,
  fetchArticleById,
  changeVotes,
  fetchUsers,
  fetchCommentsByArticleId,
} = require('./models')

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const ArticleId = req.params.article_id
  fetchArticleById(ArticleId).then((article) => {
    //        console.log(article[0])
    res.status(200).send(article[0])
  })
}

exports.patchVotesByArticleId = (req, res, next) => {
  let votes = req.body.inc_votes
  const id = Number(req.params.article_id)

  if (typeof votes !== 'number' && votes) {
    res.status(400).send('Bad request')
  }

  if (isNaN(id)) {
    res.status(400).send('Bad request')
  }

  if (votes === undefined) {
    votes = 0
  }

  changeVotes(votes, id)
    .then((article) => {
      if (article.length === 0) {
        res.status(404).send('Path not found')
      }
      res.status(200).send({ article: article[0] })
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

exports.getArticleById = (req, res, next) => {
  const ArticleId = req.params.article_id
  fetchArticleById(ArticleId)
    .then((article) => {
      //        console.log(article[0])
      res.status(200).send(article[0])
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
  console.log('You are in the controller')
  const ArticleId = req.params.article_id
  fetchCommentsByArticleId(ArticleId).then((comments) => {
    res.status(200).send(comments)
  })
}
