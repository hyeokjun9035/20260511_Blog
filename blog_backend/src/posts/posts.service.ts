import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createPostDto: CreatePostDto) {
    const result: any = await this.databaseService.execute(
      'INSERT INTO posts '
      + '(category_id, title, contents, thumbnail, author_id, view_count, like_count, is_public, is_deleted, created_at, updated_at) '
      + 'VALUES (?, ?, ?, ?, ?, 0, 0, ?, 0, NOW(), NOW())',
      [
        Number(createPostDto.category_id),
        createPostDto.title,
        createPostDto.contents,
        createPostDto.thumbnail ?? null,
        createPostDto.author_id,
        createPostDto.is_public ? 'Y' : 'N',
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
      `
    SELECT
      p.*,
      c.name AS category_name,
      u.nickname
    FROM posts p
    LEFT JOIN categories c
      ON p.category_id = c.id
    LEFT JOIN users u
      ON p.author_id = u.id
    WHERE p.id = ?
      AND p.is_deleted = 'N'
    `,
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
    if (updatePostDto.contents !== undefined) {
      fields.push('contents = ?')
      params.push(updatePostDto.contents)
    }
    if (updatePostDto.author_id !== undefined) {
      fields.push('author_id = ?')
      params.push(updatePostDto.author_id)
    }
    if (updatePostDto.is_public !== undefined) {
      fields.push('is_public = ?')
      params.push(updatePostDto.is_public ? 1 : 0)
    }

    if (fields.length === 0) {
      return this.findOne(id)
    }

    params.push(id)
    params.push(id)
    await this.databaseService.execute(
      `UPDATE posts SET ${fields.join(', ')}, update_at = NOW() WHERE id = ?`,
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
