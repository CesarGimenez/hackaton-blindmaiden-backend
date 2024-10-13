import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth, getUser } from 'src/auth/decorators';
import { ApiTags } from '@nestjs/swagger';

const { SUPER } = ValidRoles;

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('doctors')
  async getDoctors() {
    return await this.userService.getDoctors();
  }

  @Get(':id')
  // @Auth(SUPER)
  async findOne(@Param('id') id: string) {
    const userFounded = await this.userService.findOne(id);
    return userFounded;
  }

  @Patch(':id')
  // @Auth(SUPER)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!id) throw new NotFoundException('No se encontro el usuario');
    const userFounded = await this.userService.findOne(id);
    if (!userFounded) throw new NotFoundException('No se encontro el usuario');
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @Auth(ValidRoles.SUPER)
  async remove(@Param('id') id: string) {
    if (!id) throw new NotFoundException('No se encontro el usuario');
    const userFounded = await this.userService.findOne(id);
    if (!userFounded) throw new NotFoundException('No se encontro el usuario');
    return this.userService.delete(id);
  }

  @Get('my-patients/:id')
  @Auth(ValidRoles.DOCTOR)
  async getMyPatients(@Param('id') id: string) {
    if (!id) throw new NotFoundException('No se encontro el usuario');
    const userFounded = await this.userService.findOne(id);
    if (!userFounded) throw new NotFoundException('No se encontro el usuario');
    return await this.userService.getMyPatients(userFounded);
  }

  @Get('patient/:id')
  @Auth(ValidRoles.DOCTOR)
  async getInfoPAtient(@Param('id') id: string) {
    if (!id) throw new NotFoundException('No se encontro el usuario');
    return await this.userService.getInfoPAtient(id);
  }

  @Get('my-info/:id')
  async getMyInfo(@Param('id') id: string) {
    return await this.userService.getMyInfo(id);
  }

  @Patch('patient-treatment/:id')
  @Auth(ValidRoles.DOCTOR)
  async updateTreatmentPatient(
    @Param('id') id: string,
    @Body() treatment: any,
  ) {
    if (!id) throw new NotFoundException('No se encontro el usuario');
    return await this.userService.updateTreatmentPatient(id, treatment);
  }
}
