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
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
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
          expect(response.body.article).toEqual({
            article_id: 12,
            title: `Moustache`,
            topic: `mitch`,
            author: `butter_bridge`,
            body: `Have you seen the size of that thing?`,
            created_at: `2020-10-11T11:24:00.000Z`,
            votes: 101,
          })
        })
    })
    test('status 400 - bad request when inc_votes is non-numeric', () => {
      const voteUpdate = { inc_votes: 'banana' }
      return request(app)
        .patch('/api/articles/12')
        .send(voteUpdate)
        .expect(400)
        .then((response) => {
          0
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
          0
          expect(response.text).toBe('Path not found')
        })
    })
  })
})
