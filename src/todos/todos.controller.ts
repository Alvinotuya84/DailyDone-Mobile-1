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
  create(
    @Request() req,
    @Body() createToDoDto: { title: string; description: string },
  ) {
    return this.todosService.create(
      req.user,
      createToDoDto.title,
      createToDoDto.description,
    );
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
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateToDoDto: { completed: boolean },
  ) {
    return this.todosService.update(+id, updateToDoDto.completed);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.delete(+id);
  }
}
