import 'dotenv/config'
import { CreateUseController } from './src/controllers/create-user.js'
import express from 'express'

const app = express()

app.use(express.json())

app.post('/api/users', async (req, res) => {
    const createUserController = new CreateUseController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`),
)
