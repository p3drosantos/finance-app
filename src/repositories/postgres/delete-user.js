import { PostgresHelper } from './helpers/postgres-helper'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        const deleteUser = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )
        return deleteUser[0]
    }
}
