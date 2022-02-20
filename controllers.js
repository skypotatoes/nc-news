const {
  fetchTopics,
  fetchArticleById,
  changeVotes,
  fetchArticles,
  fetchUsers,
  fetchCommentsByArticleId,
  insertComment,
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
    res.status(400).send({ msg: 'Bad request' })
  }

  if (isNaN(id)) {
    res.status(400).send({ msg: 'Bad request' })
  }

  if (votes === undefined) {
    votes = 0
  }

  changeVotes(votes, id)
    .then((article) => {
      if (article.length === 0) {
        res.status(404).send({ msg: 'Path not found' })
      }
      res.status(200).send({ article: article[0] })
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const ArticleId = req.params.article_id
  fetchArticleById(ArticleId).then((article) => {
    res.status(200).send(article[0])
  })
}

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users)
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
  const query = req.query
  fetchArticles(query)
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const ArticleId = req.params.article_id
  fetchArticleById(ArticleId)
    .then((article) => {
      res.status(200).send(article)
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
  const ArticleId = Number(req.params.article_id)

  if (isNaN(ArticleId)) {
    return res.status(400).send({ msg: 'Bad request' })
  }

  return Promise.all([
    fetchArticleById(ArticleId),
    fetchCommentsByArticleId(ArticleId),
  ])

    .then((promises) => {
      const comments = promises[1]
      res.status(200).send(comments)
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
  const articleId = req.params.article_id
  const newComment = req.body
  insertComment(articleId, newComment)
    .then((comment) => {
      res.status(201).send(comment)
    })
    .catch(next)
}
