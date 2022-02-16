const { fetchTopics, changeVotes } = require('./models')

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.patchVotesByArticleId = (req, res, next) => {
  const votes = req.body.inc_votes
  const id = req.params.article_id
  //console.log(id)
  if (typeof votes !== 'number') {
    res.status(400).send('Bad request')
  }
  changeVotes(votes, id)
    .then((article) => {
      // console.log("inside controller")
      //console.log(article)
      if (article.length === 0) {
        res.status(404).send('Path not found')
      }

      res.status(200).send({ article: article[0] })
    })
    .catch(next)
}
