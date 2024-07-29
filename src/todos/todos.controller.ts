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
  findAll(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.todosService.findAll(req.user, +page, +limit);
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
