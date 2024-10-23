// tests/notes.test.js
const request = require('supertest')
const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const notesRouter = require('../src/routes/notes')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/notes', notesRouter)

// Mock data file path
const dataFilePath = path.join(__dirname, '../src/data/notes.json')

// Helper to reset data before each test
beforeEach(() => {
  fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2))
})

describe('Notes API', () => {
  it('should create a new note', async () => {
    const res = await request(app).post('/api/notes').send({
      title: 'Test Note',
      content: 'This is a test note.',
    })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('Test Note')
  })

  it('should fetch all notes', async () => {
    // First, create a note
    await request(app).post('/api/notes').send({
      title: 'First Note',
      content: 'Content of the first note.',
    })

    const res = await request(app).get('/api/notes')
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].title).toBe('First Note')
  })

  it('should fetch a single note by ID', async () => {
    const postRes = await request(app).post('/api/notes').send({
      title: 'Single Note',
      content: 'Content of the single note.',
    })

    const noteId = postRes.body.id

    const res = await request(app).get(`/api/notes/${noteId}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body.title).toBe('Single Note')
  })

  it('should update a note', async () => {
    const postRes = await request(app).post('/api/notes').send({
      title: 'Old Title',
      content: 'Old content.',
    })

    const noteId = postRes.body.id

    const res = await request(app).put(`/api/notes/${noteId}`).send({
      title: 'New Title',
      content: 'New content.',
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body.title).toBe('New Title')
    expect(res.body.content).toBe('New content.')
  })

  it('should delete a note', async () => {
    const postRes = await request(app).post('/api/notes').send({
      title: 'Note to Delete',
      content: 'Content to delete.',
    })

    const noteId = postRes.body.id

    const deleteRes = await request(app).delete(`/api/notes/${noteId}`)
    expect(deleteRes.statusCode).toEqual(204)

    const getRes = await request(app).get(`/api/notes/${noteId}`)
    expect(getRes.statusCode).toEqual(404)
  })

  it('should return 404 for non-existent note', async () => {
    const res = await request(app).get('/api/notes/9999')
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('message', 'Note not found')
  })
})
