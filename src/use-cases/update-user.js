import { PostgresGetUserByEmailRepository } from '../infra/repositories/postgres-get-user-by-email-repository'
import { EmailAlreadyExistsError } from '../errors/user'
import bcrypt from 'bcrypt'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user'

export class updatedUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()

            const userAlreadyExists =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userAlreadyExists) {
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
