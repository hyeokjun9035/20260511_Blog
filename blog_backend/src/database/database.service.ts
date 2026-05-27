import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { createPool, Pool } from 'mysql2/promise'

@Injectable()
export class DatabaseService implements OnModuleDestroy {
    private pool: Pool

    constructor() {
        this.pool = createPool({
            host: process.env.DB_HOST ?? 'localhost',
            port: Number(process.env.DB_PORT ?? 3306),
            user: process.env.DB_USER ?? 'root',
            password: process.env.DB_PASS ?? 'test1234',
            database: process.env.DB_NAME ?? 'blog',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        })

        this.checkConnection();
    }

    private async checkConnection() {
        try {
            await this.pool.query('SELECT DATABASE();');
            console.log('✅ DB 연결 성공');
        } catch (err) {
            console.error('❌ DB 연결 실패', err);
        }
    }

    async query(sql: string, params?: any[]): Promise<any> {
        const [rows] = await this.pool.query(sql, params)
        return rows
    }

    async execute(sql: string, params?: any[]): Promise<any> {
        const [result] = await this.pool.execute(sql, params)
        return result
    }

    async onModuleDestroy() {
        await this.pool.end()
    }
}
