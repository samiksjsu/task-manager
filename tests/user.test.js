const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('../tests/fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Samik Biswas',
        email: 'samik.biswas@sjsu.edu',
        password: 'cyberplanning_92'
    }).expect(201)

    // Assert that the DB have been changed correctly
    const user = User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Samik Biswas',
            email: 'samik.biswas@sjsu.edu'
        }
    })

    expect(user.password).not.toBe('cyberplanning_92')
})

test('Should log in existing user', async () => {

    const response = await request(app).post('/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not log in non existant user', async () => {
    await request(app).post('/users/login')
    .send({
        email: 'samik.biswas22@gmail.com',
        password: 'jdhf'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me/')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull
})

test('Should not delete account for user when unauthenticated', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update user when authorized', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Jess'
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Jess')
})

test('Should not update invalid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'California'
    })
    .expect(400)
})


/*
Other possible test cases:

https://links.mead.io/extratests

*/