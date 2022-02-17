const { fetchTopics, changeVotes } = require('./models')

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
    //  console.log('votes was detected as NaN')
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
