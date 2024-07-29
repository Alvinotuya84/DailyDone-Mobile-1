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

  async findAll(
    user: User,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ToDo[]; total: number }> {
    const [result, total] = await this.todoRepository.findAndCount({
      where: { user },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' }, // Optional: Sort by ID descending
    });
    return { data: result, total };
  }

  async update(id: number, completed: boolean): Promise<void> {
    await this.todoRepository.update(id, { completed });
  }

  async delete(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
