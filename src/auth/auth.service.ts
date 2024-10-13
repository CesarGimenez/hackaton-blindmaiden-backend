import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { JwtPayload } from './interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}
  async login(user: User): Promise<{ access_token: string }> {
    const { id } = user;
    const payload = { id };
    const token = this.getJwtToken(payload);
    return { access_token: token };
  }

  async register(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const newUser = new this.userModel({
      ...createUserDto,
      password: bcrypt.hashSync(password, 10),
    });
    await newUser.save();
    return newUser;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  comparePasswords(password: string, storedPassword: string) {
    return bcrypt.compareSync(password, storedPassword);
  }

  async getMe(user: User) {
    const { _id } = user;
    return await this.userModel.findOne({ _id });
  }

  async checkAuthStatus(user: User) {
    const { id } = user;
    const payload = { id };
    const token = this.getJwtToken(payload);
    return { access_token: token };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
