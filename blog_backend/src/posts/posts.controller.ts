import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any
  ) {
    console.log(createPostDto)
    return this.postsService.create({
      ...createPostDto,
      author_id: req.user.id,
    });
  }

  @Get()
  findAll() {
    return this.postsService.findAll()
  }

  @Get('count')
  countAll() {
    return this.postsService.countAll()
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id)
  }
  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  findAllAdmin() {
    return this.postsService.findAllAdmin()
  }

  @Get('admin/count')
  countAllAdmin() {
    return this.postsService.countAllAdmin()
  }
}
