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
      return request(app)
        .get('/bad-pathway')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual('Path not found')
        })
    })
  })

  describe('GET /api/articles/:article_id', () => {
    test('status 200 - responds with an article object with appropriate properties', () => {
      return request(app)
        .get('/api/articles/9')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Well? Think about it.',
            created_at: '2020-06-06T09:10:00.000Z',
            votes: 0,
          })
        })
    })
  })

  describe('GET /api/users', () => {
    test('status 200 - responds with an array of objects with username property', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: users }) => {
          console.log(users)
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
})
