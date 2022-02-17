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
      //    `SELECT * FROM articles WHERE article_id = $1`, [articleID])
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles 
  INNER JOIN comments 
  ON articles.article_id = comments.article_id 
  WHERE articles.article_id=$1 
  GROUP BY articles.article_id`,
      [articleID],
    )
    .then((results) => results.rows)
}
