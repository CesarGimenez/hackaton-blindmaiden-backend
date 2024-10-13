import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from '../appointments/entities/appointment.entity';
import { GoalSchema } from './entities/goal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Goal', schema: GoalSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
