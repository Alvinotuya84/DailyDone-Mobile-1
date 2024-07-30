import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(
    username: string,
    password: string,
  ): Promise<{ data: User; success: boolean }> {
    // Check if the username already exists
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    const createdUser = await this.usersRepository.save(user);

    // Return the created user along with success status
    return { data: createdUser, success: true };
  }
}
