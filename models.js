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

exports.fetchArticleById = (articleID) => {
  return db
    .query(
      `
    SELECT * FROM articles WHERE article_id = $1`,
      [articleID],
    )
    .then((results) => results.rows)
}

exports.fetchUsers = () => {
  return db
    .query(
      `
  SELECT username FROM users
  `,
    )
    .then((results) => results.rows)
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

exports.fetchCommentsByArticleId = (articleID) => {
  console.log('You are in the model')
  return db
    .query(
      `
          SELECT * FROM comments WHERE article_id = $1`,
      [articleID],
    )
    .then((results) => {
      console.log(results.rows)
      return results.rows
    })
}
