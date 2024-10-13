import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './entities/appointment.entity';
import { GoalSchema } from '../user/entities/goal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Goal', schema: GoalSchema }]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
