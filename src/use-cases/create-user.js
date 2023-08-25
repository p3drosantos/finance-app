import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //gerar senha do user
        const userId = uuidv4()

        //criptografar senha
        const passwordHash = await bcrypt.hash(createUserParams.password, 10)

        //inserir o usuario no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: passwordHash,
        }

        //chamar o repositorio
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
