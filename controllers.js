const {fetchTopics, fetchArticleById} = require('./models')

exports.getTopics = (req, res, next)=> {
    fetchTopics()
    .then(topics=>{
        res.status(200).send({topics});
    })
    .catch(next);
}

exports.getArticleById = (req, res, next)=>{
    const ArticleId = req.params.article_id
    fetchArticleById(ArticleId)
    .then(article=>{
//        console.log(article[0])
        res.status(200).send(article[0]);
    })
    .catch(next)
}