// src/todos/todos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from './todo.entity';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ToDo])],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
