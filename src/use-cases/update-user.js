import bcrypt from 'bcrypt'
import {
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyExistsError } from '../errors/user.js'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyExistsError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        if (updateUserParams.password) {
            const passwordHash = await bcrypt.hash(
                updateUserParams.password,
                10,
            )

            user.password = passwordHash
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

        const updateUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )

        return updateUser
    }
}
