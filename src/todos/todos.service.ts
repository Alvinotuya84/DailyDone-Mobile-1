// src/todos/todos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToDo } from './todo.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(ToDo)
    private todoRepository: Repository<ToDo>,
  ) {}

  async create(user: User, title: string, description: string): Promise<ToDo> {
    const todo = this.todoRepository.create({
      title,
      description,
      completed: false,
      user,
    });
    return this.todoRepository.save(todo);
  }

  async findAll(user: User): Promise<ToDo[]> {
    return this.todoRepository.find({ where: { user } });
  }

  async update(id: number, completed: boolean): Promise<void> {
    await this.todoRepository.update(id, { completed });
  }

  async delete(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
