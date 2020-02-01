const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, setupDatabase, userTwoId, taskOne } = require('../tests/fixtures/db')

beforeEach(setupDatabase)

test('Should create task for users', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should return all tasks for a particular user', async () => {
    const response = await request(app)
                    .get('/tasks')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete when another user tries to delete someone else"s task', async () => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwoId}`)
    .send(),
    expect(401)
})