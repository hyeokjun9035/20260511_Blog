import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoryService {

    constructor(private readonly databaseService: DatabaseService) { }

    async findAll() {
        return this.databaseService.query(`
    SELECT
      id,
      parent_id,
      name
    FROM categories
    ORDER BY parent_id, name
  `)
    }

}
