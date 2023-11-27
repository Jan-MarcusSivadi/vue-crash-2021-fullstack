const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/../../.env') })
const express = require('express')
const port = process.env.PORT

const app = express()

// GET: test connection
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Connection established' })
})

// GET: get all tasks
app.get('/api/tasks', (req, res) => {
    res.status(200).send({ message: 'get all tasks' })
})

// GET: get one task
app.get('/api/tasks/:id', (req, res) => {
    res.status(200).send({ message: 'get one task' })
})

// POST: create new tasks
app.post('/api/tasks', (req, res) => {
    res.status(201).send({ message: 'create new tasks' })
})

// PUT: update one task
app.put('/api/tasks/:id', (req, res) => {
    res.status(200).send({ message: 'update one task' })
})

// DELETE: delete one task
app.delete('/api/tasks/:id', (req, res) => {
    res.status(204).send({ message: 'delete one task' })
})

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/../../client/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../../client/dist', 'index.html'))
    })
}

app.listen(port, () => console.log(`server running on port ${port}`))