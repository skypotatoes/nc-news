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

exports.fetchUsers = () => {
  return db
    .query(
      `
  SELECT username FROM users;
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
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles
      INNER JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id=$1
      GROUP BY articles.article_id;`,
      [articleID],
    )
    .then((results) => {
      // console.log(results.rows)
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' })
      }
      return results.rows[0]
    })
}

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `
          SELECT * FROM comments WHERE article_id = $1`,
      [articleId],
    )
    .then((results) => {
      return results.rows
    })
}

exports.fetchArticles = (query) => {
  let col = `created_at`
  let order = 'DESC'

  const validOrders = ['ASC', 'DESC']

  const validTopics = ['mitch', 'cats', 'paper']

  const greenList = [
    `author`,
    `title`,
    `article_id`,
    `topic`,
    `created_at`,
    `votes`,
    `comment_count`,
  ]

  //all this validation should take place in the controllers
  if (query.sort_by && !greenList.includes(query.sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad request' })
  }

  if (query.sort_by) {
    col = query.sort_by
  }

  if (query.order && !validOrders.includes(query.order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: 'Bad request' })
  }

  if (query.order === 'asc') {
    order = 'ASC'
  }

  let queryString = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id`

  if (validTopics.includes(query.topic)) {
    queryString += ` WHERE articles.topic = '${query.topic}'`
  }

  queryString += ` GROUP BY articles.article_id
  ORDER BY ${col} ${order}`

  return db
    .query(
      queryString,
      //   //SELECT author, title, article_id, topic, created_at, votes FROM articles;
      //   `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      // FROM articles
      // LEFT OUTER JOIN comments
      // ON articles.article_id = comments.article_id

      // GROUP BY articles.article_id
      // ORDER BY ${col} ${order}

      // ;`,
    )
    .then((results) => {
      return results.rows
    })
}

exports.insertComment = (articleId, comment) => {
  const author = comment.username
  const body = comment.body
  const id = Number(articleId)
  return db
    .query(
      `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3) RETURNING *;`,
      [author, body, id],
    )
    .then((results) => {
      return results.rows[0]
    })
}
