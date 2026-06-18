import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createPostDto: CreatePostDto) {
    const result: any = await this.databaseService.execute(
      `INSERT INTO posts (
      category_id,
      title,
      contents,
      thumbnail,
      author_id,
      view_count,
      like_count,
      status,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, 0, 0, ?, NOW(), NOW())`,
      [
        Number(createPostDto.category_id),
        createPostDto.title,
        createPostDto.contents,
        createPostDto.thumbnail ?? null,
        Number(createPostDto.author_id),
        createPostDto.status ?? 'DRAFT',
      ],
    )

    const insertedId = result?.insertId

    return this.findOneAdmin(insertedId)
  }


  findAll() {
    return this.databaseService.query(
      `SELECT
        p.*,
        CONCAT(p.id, '') AS slug,
        c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'PUBLISHED'
      ORDER BY p.created_at DESC`
    )
  }

  async findAllAdmin() {
    return this.databaseService.query(`
    SELECT
      p.*,
      CONCAT(p.id, '') AS slug,
      c.name AS category_name,
      CASE p.status
        WHEN 'DRAFT' THEN '임시저장'
        WHEN 'PUBLISHED' THEN '공개'
        WHEN 'PRIVATE' THEN '비공개'
        WHEN 'DELETED' THEN '삭제'
      END AS status_label
    FROM posts p
    LEFT JOIN categories c
      ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `)
  }

  async countAll() {
    const rows: any = await this.databaseService.query(
      'SELECT COUNT(id) AS count FROM posts WHERE status = "PUBLISHED" AND status = "PRIVATE"',
    )

    return rows[0]?.count ?? 0
  }

  async countAllAdmin() {
    const rows: any = await this.databaseService.query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'PUBLISHED') AS published,
      SUM(status = 'PRIVATE') AS private,
      SUM(status = 'DRAFT') AS draft,
      SUM(status = 'DELETED') AS deleted
    FROM posts
  `)

    return rows[0]
  }

  async findOne(id: number) {
    const rows: any = await this.databaseService.query(
      `
    SELECT p.*, CONCAT(p.id, '') AS slug, c.name AS category_name FROM posts p LEFT JOIN
    categories c ON p.category_id = c.id WHERE p.id = ? AND p.status = 'PUBLISHED'
    `,
      [id],
    )
    const post = rows[0]
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`)
    }
    return post
  }

  async findOneAdmin(id: number) {
    const rows: any = await this.databaseService.query(
      `     
      SELECT
      p.*,
      CONCAT(p.id, '') AS slug,
      c.name AS category_name,
      CASE p.status
        WHEN 'DRAFT' THEN '임시저장'
        WHEN 'PUBLISHED' THEN '공개'
        WHEN 'PRIVATE' THEN '비공개'
        WHEN 'DELETED' THEN '삭제'
      END AS status_label
    FROM posts p
    LEFT JOIN categories c
      ON p.category_id = c.id
    WHERE p.id = ?
    `,
      [id],
    )

    const post = rows[0]

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`)
    }

    return post
  }


  async findBySlug(slug: string) {
    const id = Number(slug)
    if (!Number.isInteger(id) || id <= 0) {
      throw new NotFoundException(`Post with slug ${slug} not found.`)
    }
    return this.findOne(id)
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
    if (updatePostDto.status) {
      fields.push('status = ?')
      params.push(updatePostDto.status)
    }

    if (fields.length === 0) {
      return this.findOne(id)
    }

    params.push(id)
    await this.databaseService.execute(
      `UPDATE posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params,
    )
    return this.findOne(id)
  }

  async remove(id: number) {
    const post = await this.findOne(id)
    await this.databaseService.execute(`
      UPDATE posts
      SET status = 'DELETED',
            deleted_at = NOW()
      WHERE id = ?
      `, [id])
    return post
  }
}
