const {fetchTopics, changeVotes} = require('./models')

exports.getTopics = (req, res, next)=> {
    fetchTopics()
    .then(topics=>{
        res.status(200).send({topics});
    })
    .catch(next);
}

exports.patchVotesByArticleId = (req, res, next)=>{
    console.log("You are here 1")
    const votes = req.body.inc_votes
    const id = req.params.article_id
    changeVotes(votes, id)
    .then(article=>{
        console.log(article)
        res.status(200).send(article)
    })
    .catch(err => console.log(err))
}