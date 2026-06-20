import { Injectable, OnModuleInit } from '@nestjs/common'
import * as mysql from 'mysql2/promise'

@Injectable()
export class DatabaseService implements OnModuleInit {
  private connection: mysql.Connection

  async onModuleInit() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
      })
      console.log('Database connected successfully')
    } catch (error) {
      console.error('Database connection failed:', error)
      throw error
    }
  }

  async query(sql: string, params?: any[]) {
    try {
      const [rows] = await this.connection.execute(sql, params || [])
      return rows
    } catch (error) {
      console.error('Query failed:', error)
      throw error
    }
  }

  async execute(sql: string, params?: any[]) {
    try {
      const result = await this.connection.execute(sql, params || [])
      return result[0]
    } catch (error) {
      console.error('Execute failed:', error)
      throw error
    }
  }

  async getConnection(): Promise<mysql.Connection> {
    return this.connection
  }
}
