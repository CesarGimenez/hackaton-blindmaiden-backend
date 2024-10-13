import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new UnauthorizedException('El token no es valido');
    }

    if (!user.active) {
      throw new UnauthorizedException('El usuario no esta inactivo');
    }

    return user;
  }
}
