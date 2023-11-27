const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/../../.env') })
const express = require('express')
const port = process.env.PORT

// const { MongoClient, ServerApiVersion } = require("mongodb")
const mongoose = require('mongoose')
var ObjectId = require('mongoose').Types.ObjectId; 
const { Task } = require("./Schems/taskSchem")

const uri = process.env.DB_URI

const app = express()

// const client = new MongoClient(uri, {
//     serverApi: ServerApiVersion.v1,
// })

const run = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URI)
        console.log(connection)
    } catch (error) {
        console.log(error)
    }
}
run()

// GET: test connection
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Connection established' })
})

// GET: get all tasks
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find({ user: new ObjectId("62efef23e4be0f62504d5719") })

    res.status(200).send(tasks)
})

// GET: get one task
app.get('/api/tasks/:id', async (req, res) => {
    const { id } = req.params

    if (!Number(id)) {
        res.status(400).send({ message: 'Invalid identifier.' })
        return
    }

    let task
    try {
        task = await Task.findOne({ id: id })
    } catch (error) {
        console.error(error)
    }

    if (!task) {
        res.status(404).send({ message: 'Task not found.' })
        return
    }

    res.status(200).send(task)
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