import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('Appointment') private appointmentModel: Model<Appointment>,
  ) {}

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(_id: string) {
    return await this.userModel.findOne({ _id });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.updateOne({ _id }, updateUserDto);
    return {
      message: 'user updated',
      user,
    };
  }

  async delete(_id: string): Promise<{ message: string; deleted: any }> {
    const deleted = await this.userModel.deleteOne({ _id });
    return {
      message: 'user deleted',
      deleted,
    };
  }

  async getMyPatients(user: User) {
    const { _id } = user;
    return await this.userModel.find({ doctor: _id });
  }

  async getDoctors() {
    return await this.userModel.find({ role: 'DOCTOR' });
  }

  async getInfoPAtient(id: string) {
    const patient = await this.userModel.findOne({ _id: id });
    if (!patient) throw new NotFoundException('No se encontro el usuario');
    const appointments = await this.appointmentModel
      .find({ patient: id })
      .sort({ date: 1 });
    return { patient, appointments };
  }

  async updateTreatmentPatient(id: string, treatment: any) {
    return await this.userModel.updateOne({ _id: id }, { treatment });
  }

  async getMyInfo(id: string) {
    const me = await this.userModel.findById(id);
    const pipeline = [
      {
        $match: {
          _id: me?._id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      {
        $unwind: '$doctor',
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'patient',
          as: 'appointments',
        },
      },
      {
        $lookup: {
          from: 'goals',
          localField: '_id',
          foreignField: 'user',
          as: 'goals',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          doctor: 1,
          goals: 1,
          appointments: 1,
          pendingAppointments: {
            $size: {
              $filter: {
                input: '$appointments',
                as: 'appointment',
                cond: { $eq: ['$$appointment.status', 'pending'] },
              },
            },
          },
          completeAppointments: {
            $size: {
              $filter: {
                input: '$appointments',
                as: 'appointment',
                cond: { $eq: ['$$appointment.status', 'complete'] },
              },
            },
          },
          canceledAppointments: {
            $size: {
              $filter: {
                input: '$appointments',
                as: 'appointment',
                cond: { $eq: ['$$appointment.status', 'canceled'] },
              },
            },
          },
          totalAppointments: { $size: '$appointments' },
        },
      },
      {
        $limit: 1,
      },
    ];

    const result: any = await this.userModel.aggregate(pipeline);
    const progress =
      ((result[0]?.totalAppointments - result[0]?.pendingAppointments) /
        result[0]?.totalAppointments) *
      100;
    let message = '';
    if (progress === 0) {
      message = 'Es tiempo de empezar! 🙂';
    } else if (progress > 30 && progress < 70) {
      message = 'Vamos por buen camino! 💪';
    } else if (progress > 70 && progress < 90) {
      message = 'Estamos muy cerca de lograrlo! 😄';
    } else if (progress > 90 && progress < 100) {
      message = 'Ya casi! 🥹';
    } else if (progress === 100) {
      message = 'El proceso ha finalizado! Felicidades 🎉';
    }
    result[0].goals = result[0].goals.reverse();
    result[0]['progress'] = progress.toFixed(2);
    result[0]['message'] = message;
    return result[0];
  }
}
