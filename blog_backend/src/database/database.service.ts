import { Injectable, OnModuleInit } from '@nestjs/common'
import * as mysql from 'mysql2/promise'

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool!: mysql.Pool;

  async onModuleInit() {
    console.log("DB_HOST =", process.env.DB_HOST);
    console.log("DB_PORT =", process.env.DB_PORT);
    console.log("DB_USER =", process.env.DB_USER);
    try {
      this.pool = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
      })
      console.log("Database pool connected");
    } catch (error) {
      console.error('Database connection failed:', error)
      throw error
    }
  }

  async query(sql: string, params?: any[]) {
    try {
      const [rows] = await this.pool.execute(sql, params || [])
      return rows
    } catch (error) {
      console.error('Query failed:', error)
      throw error
    }
  }

  async execute(sql: string, params?: any[]) {
    try {
      const result = await this.pool.execute(sql, params || [])
      return result[0]
    } catch (error) {
      console.error('Execute failed:', error)
      throw error
    }
  }

  async getConnection(): Promise<mysql.Connection> {
    return this.pool
  }
}
