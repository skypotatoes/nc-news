const seed = require('../db/seeds/seed')
const express = require('express')
const app = require('../app')
const request = require('supertest')
const data = require('../db/data/test-data/index')
const db = require('../db/connection')

afterAll(() => db.end())

beforeEach(() => {
  return seed(data)
})

describe('app', () => {
  describe('GET /api/topics', () => {
    test('status 200 - responds with an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3)
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              }),
            )
          })
        })
    })
  })
  describe('GET /bad-pathway', () => {
    test('status 404 - path not found', () => {
      return request(app).get('/bad-pathway').expect(404)
    })
  })

  describe('PATCH /api/articles/:article_id', () => {
    test('status 200 - responds with updated article', () => {
      const voteUpdate = { inc_votes: 101 }
      return request(app)
        .patch('/api/articles/12')
        .send(voteUpdate)
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 12,
              title: `Moustache`,
              topic: `mitch`,
              author: `butter_bridge`,
              body: `Have you seen the size of that thing?`,
              created_at: `2020-10-11T11:24:00.000Z`,
              votes: 101,
            }),
          )
        })
    })
    test('status 400 - bad request when inc_votes is non-numeric', () => {
      const voteUpdate = { inc_votes: 'banana' }
      return request(app)
        .patch('/api/articles/12')
        .send(voteUpdate)
        .expect(400)
        .then((response) => {
          expect(response.text).toBe('Bad request')
        })
    })

    test('status 404 - not found when article_id does not exist', () => {
      const voteUpdate = { inc_votes: 25 }
      return request(app)
        .patch('/api/articles/99999')
        .send(voteUpdate)
        .expect(404)
        .then((response) => {
          expect(response.text).toBe('Path not found')
        })
    })

    test('status 400 - bad request when article ID is invalid', () => {
      const voteUpdate = { inc_votes: 25 }
      return request(app)
        .patch('/api/articles/banana')
        .send(voteUpdate)
        .expect(400)
        .then((response) => {
          expect(response.text).toBe('Bad request')
        })
    })

    test('status 200 - no inc_votes value on the request body', () => {
      const voteUpdate = {}
      return request(app)
        .patch('/api/articles/1')
        .send(voteUpdate)
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual({
            article_id: 1,
            title: `Living in the shadow of a great man`,
            topic: `mitch`,
            author: `butter_bridge`,
            body: `I find this existence challenging`,
            created_at: `2020-07-09T20:11:00.000Z`,
            votes: 100,
          })
        })
    })
  })

  describe('GET /bad-pathway', () => {
    test('status 404 - path not found', () => {
      return request(app)
        .get('/bad-pathway')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('Path not found')
        })
    })
  })

  describe('GET /api/users', () => {
    test('status 200 - responds with an array of objects with username property', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: users }) => {
          expect(users).toHaveLength(4)

          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              }),
            )
          })
        })
    })
  })

  describe('GET /api/articles/', () => {
    test('status 200 - responds with an articles array of article objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body
          expect(articles).toBeInstanceOf(Array)
          expect(articles).toHaveLength(12)
          articles.forEach((article) =>
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              }),
            ),
          )
        })
    })
  })

  describe('GET /bad-pathway', () => {
    test('status 404 - path not found', () => {
      return request(app)
        .get('/bad-pathway')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('Path not found')
        })
    })
  })

  describe('GET /api/articles/:article_id/comments', () => {
    test('status 200 - responds with array of comments with appropriate properties', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: comments }) => {
          expect(comments).toHaveLength(11)
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              }),
            )
          })
        })
    })

    test('status 404 - Article not found', () => {
      return request(app)
        .get('/api/articles/999999/comments')
        .expect(404)
        .then(({ body }) => {
          // console.log(body)
          expect(body.msg).toEqual('Article not found')
        })
    })

    test('status 400 - Bad request', () => {
      return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual('Bad request')
        })
    })
  })

  describe('GET /api/articles/:article_id', () => {
    test('status 200 - responds with an article object with appropriate properties', () => {
      return request(app)
        .get('/api/articles/9')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              article_id: 9,
              title: "They're not exactly dogs, are they?",
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'Well? Think about it.',
              created_at: '2020-06-06T09:10:00.000Z',
              votes: 0,
            }),
          )
        })
    })
    test('status 200 - article response includes comment_count', () => {
      return request(app)
        .get('/api/articles/1') //should return comment_count of 11
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              comment_count: '11',
            }),
          )
        })
    })

    test('status 400 - bad request', () => {
      return request(app)
        .get('/api/articles/banana')
        .expect(400)
        .then(({ body }) => expect(body.msg).toEqual('Bad request'))
    })

    test('status 404 - Article not found', () => {
      return request(app)
        .get('/api/articles/999999999')
        .expect(404)
        .then(({ body }) => expect(body.msg).toEqual('Article not found'))
    })
  })
})
