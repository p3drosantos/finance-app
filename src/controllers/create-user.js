import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, serverError } from './helper.js'
import validator from 'validator'

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

            const passwordIsValid = params.password.length < 6

            if (passwordIsValid) {
                return badRequest({
                    message: `Password must be at least 6 characters`,
                })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest({
                    message: `invalid email. Please provide a valid one`,
                })
            }

            //chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            //retornar a resposta para o usuario (status code)
            return created(createdUser)
        } catch (error) {
            console.error(error)
            return serverError({ message: 'Internal server error' })
        }
    }
}
