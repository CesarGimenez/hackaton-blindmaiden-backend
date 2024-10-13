import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { UserSchema } from 'src/modules/user/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET') || '123456',
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN') || '24h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    MongooseModule,
    AuthService,
    JwtStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
