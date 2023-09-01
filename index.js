import 'dotenv/config'
import express from 'express'

import { CreateUseController } from './src/controllers/create-user.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'
import { UpdateUserController } from './src/controllers/update-user.js'

const app = express()

app.use(express.json())

app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdController = new GetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (req, res) => {
    const updateUserController = new UpdateUserController()

    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).send(body)
})

app.post('/api/users', async (req, res) => {
    const createUserController = new CreateUseController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`),
)
