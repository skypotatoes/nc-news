const {
  fetchTopics,
  fetchArticleById,
  changeVotes,
  fetchArticles,
  fetchUsers,
  fetchCommentsByArticleId,
  insertComment,
  removeCommentById,
} = require('./models')

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
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

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users)
    })
    .catch(next)
}

exports.getArticles = (req, res, next) => {
  const query = req.query

  if (req.query.topic) {
    fetchTopics()
      .then((topics) => {
        const arrSlugs = []
        topics.forEach((topic) => {
          arrSlugs.push(topic.slug)
        })
        if (!arrSlugs.includes(req.query.topic)) {
          return Promise.reject({ status: 404, msg: 'Topic not found' })
        }
      })
      .catch(next)
  }

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
      res.status(200).send({ article: article })
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
      res.status(200).send({ comments: comments })
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

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id
  removeCommentById(commentId)
    .then((comment) => {
      if (comment.length === 0) {
        res.status(404).send({ msg: 'Comment not found' })
      } else {
        res.status(204).send({})
      }
    })
    .catch(next)
}
