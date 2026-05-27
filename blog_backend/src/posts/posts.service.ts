import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPostDto: CreatePostDto) {
    const result: any = await this.databaseService.execute(
      'INSERT INTO posts (title, content, author, published) VALUES (?, ?, ?, ?)',
      [
        createPostDto.title,
        createPostDto.content,
        createPostDto.author ?? null,
        createPostDto.published ?? false,
      ],
    )

    const insertedId = (result as any)?.insertId
    return this.findOne(insertedId)
  }

  findAll() {
    return this.databaseService.query('SELECT * FROM posts ORDER BY created_at DESC')
  }

  async findOne(id: number) {
    const rows: any = await this.databaseService.query(
      'SELECT * FROM posts WHERE id = ?',
      [id],
    )
    const post = rows[0]
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`)
    }
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const fields: string[] = []
    const params: any[] = []

    if (updatePostDto.title !== undefined) {
      fields.push('title = ?')
      params.push(updatePostDto.title)
    }
    if (updatePostDto.content !== undefined) {
      fields.push('content = ?')
      params.push(updatePostDto.content)
    }
    if (updatePostDto.author !== undefined) {
      fields.push('author = ?')
      params.push(updatePostDto.author)
    }
    if (updatePostDto.published !== undefined) {
      fields.push('published = ?')
      params.push(updatePostDto.published)
    }

    if (fields.length === 0) {
      return this.findOne(id)
    }

    params.push(id)
    await this.databaseService.execute(
      `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`,
      params,
    )
    return this.findOne(id)
  }

  async remove(id: number) {
    const post = await this.findOne(id)
    await this.databaseService.execute('DELETE FROM posts WHERE id = ?', [id])
    return post
  }
}
