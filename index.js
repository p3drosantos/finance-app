import 'dotenv/config'
import express from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js'

PostgresHelper

const app = express()

app.get('/', async (req, res) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')

    res.send(JSON.stringify(results))
})

app.listen(3000, () => console.log('listening o port 3000!!'))
