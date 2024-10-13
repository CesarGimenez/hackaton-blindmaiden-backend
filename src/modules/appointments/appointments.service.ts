import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './entities/appointment.entity';
import { Goal } from '../user/entities/goal.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel('Appointment') private appointmentModel: Model<Appointment>,
    @InjectModel('Goal') private goalModel: Model<Goal>,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return await createdAppointment.save();
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentModel.findById(id);
    const apCompletedByPatient = await this.appointmentModel
      .find({
        patient: appointment?.patient,
        status: 'complete',
        type: 'Consulta',
      })
      .sort({ date: 1 });

    const quiomioCompletedByPatient = await this.appointmentModel
      .find({
        patient: appointment?.patient,
        status: 'complete',
        type: 'Quimioterapia',
      })
      .sort({ date: 1 });

    await this.appointmentModel.findByIdAndUpdate(
      id,
      { $set: updateAppointmentDto },
      { new: true },
    );

    if (updateAppointmentDto.status === 'complete') {
      if (apCompletedByPatient.length < 1 && appointment.type === 'Consulta') {
        const firstGoal = new this.goalModel({
          user: appointment?.patient,
          name: 'Has completado tu primera consulta! 🤩',
        });
        await firstGoal.save();
      }

      if (
        quiomioCompletedByPatient.length < 1 &&
        appointment.type === 'Quimioterapia'
      ) {
        const firstGoalQuimio = new this.goalModel({
          user: appointment?.patient,
          name: 'Has completado tu primera quimioterapia! 🤩',
        });
        await firstGoalQuimio.save();
      }
    }

    return {
      message: 'Cita actualizada',
    };
  }

  async findMyAppointments(id: string) {
    return await this.appointmentModel
      .find({ doctor: id })
      .sort({ date: 1 })
      .populate('patient');
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
