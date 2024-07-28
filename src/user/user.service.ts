import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: CreateUserDto) {
    const candidate = await this.userModel.findOne({
      $or: [{ username: user.username }, { email: user.email }],
    });

    if (candidate) {
      throw new ConflictException('Такий користувач уже існує');
    }

    const hashedPassword = await hash(user.password, 12);

    const newUser = new this.userModel({
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    await newUser.save();
    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async findByLogin(login: string) {
    return this.userModel.findOne({
      $or: [{ username: login }, { email: login }],
    });
  }
}
