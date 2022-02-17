const db = require('./db/connection')

exports.fetchTopics = () => {
  return db
    .query(
      `
    SELECT slug, description FROM topics
    `,
    )
    .then((results) => {
      return results.rows
    })
}

exports.changeVotes = (newVotes, id) => {
  return db
    .query(
      `
        UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `,
      [newVotes, id],
    )
    .then((result) => {
      return result.rows
    })
}

exports.fetchArticleById = (articleID) => {
  return db
    .query(
      `
    SELECT * FROM articles WHERE article_id = $1`,
      [articleID],
    )
    .then((results) => results.rows)
}

exports.fetchArticles = () => {
  return db
    .query(
      `
    SELECT author, title, article_id, topic, created_at, votes FROM articles
  `,
    )
    .then((results) => {
      return results.rows
    })
}
