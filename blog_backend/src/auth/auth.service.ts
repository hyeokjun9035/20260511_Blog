import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { DatabaseService } from '../database/database.service'
import { LoginDto } from './dto/login.dto'
import { JoinDto } from './dto/join.dto'

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService) { }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto

        // Query user from database
        const users: any = await this.databaseService.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
        )

        const user = (users as any[])?.[0]
        if (!user) {
            throw new UnauthorizedException('Invalid username or password')
        }

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid username or password')
        }

        // Sign JWT with 1 hour expiry
        const payload = { sub: user.id, username: user.username, role: user.role }
        const token = this.jwtService.sign(payload)

        return {
            token,
            expiresIn: 3600,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        }
    }

    private validatePassword(password: string) {
        const lower = /[a-z]/.test(password)
        const digit = /\d/.test(password)
        const special = /[^A-Za-z0-9]/.test(password)
        const matches = [lower, digit, special].filter(Boolean).length
        return password.length >= 8 && matches >= 2
    }

    async join(joinDto: JoinDto) {
        const { username, password, role } = joinDto

        if (!this.validatePassword(password)) {
            throw new BadRequestException('비밀번호는 8자 이상이며 소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.')
        }

        const existingUsers: any = await this.databaseService.query(
            'SELECT id FROM users WHERE username = ?',
            [username],
        )
        if ((existingUsers as any[]).length > 0) {
            throw new ConflictException('이미 사용 중인 이메일입니다.')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await this.databaseService.execute(
            'INSERT INTO users (username, password, role, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [username, hashedPassword, 'admin'],
        )

        return {
            message: '관리자 계정이 생성되었습니다. 로그인 후 사용해주세요.',
        }
    }
}
