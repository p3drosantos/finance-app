import { CreateUserUseCase } from '../use-cases/create-user.js'
import { EmailAlreadyExistsError } from '../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
} from './helpers/index.js'

export class CreateUseController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            //validar por campos obrigatorios e tamanho de senha
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().lenght === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse()
            }

            //chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            //retornar a resposta para o usuario (status code)
            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyExistsError) {
                return badRequest({ message: error.message })
            }

            console.error(error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
