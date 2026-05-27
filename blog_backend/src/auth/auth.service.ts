import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { DatabaseService } from '../database/database.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService) { }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto

        // Query user from database
        const users: any = await this.databaseService.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
        )

        const user = (users as any[])?.[0]
        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (password !== user.password) {
            throw new UnauthorizedException('Invalid email or password')
        }

        // Return user data with token (simple JWT-like token, replace with real JWT later)
        const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64')

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        }
    }
}
