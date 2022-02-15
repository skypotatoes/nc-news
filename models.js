const db = require('./db/connection')

exports.fetchTopics = ()=>{
    return db.query(`
    SELECT slug, description FROM topics
    `).then(results=>{
        return results.rows
    })
}

exports.fetchArticleById = (articleID)=>{
    return db.query(`
    SELECT * FROM articles WHERE article_id = $1`, [articleID])
    .then(results=> results.rows)
}