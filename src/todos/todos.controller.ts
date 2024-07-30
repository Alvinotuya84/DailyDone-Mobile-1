import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createToDoDto: { title: string; description: string },
  ) {
    const result = await this.todosService.create(
      req.user,
      createToDoDto.title,
      createToDoDto.description,
    );
    return {
      success: true,
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const { data, total } = await this.todosService.findAll(
      req.user,
      +page,
      +limit,
    );
    const totalPages = Math.ceil(total / +limit);
    return {
      data: data,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: +page,
        pageSize: +limit,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateToDoDto: { completed: boolean },
  ) {
    return this.todosService.update(+id, updateToDoDto.completed);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.todosService.delete(+id);
  }
}
