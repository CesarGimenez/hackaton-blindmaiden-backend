import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @ApiProperty({ example: 'Cesar' })
  name: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsString({ message: 'El email debe ser un string' })
  @IsEmail()
  @ApiProperty({ example: 'Pb3Jt@example.com' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser un string' })
  @ApiProperty({ example: '123456' })
  password: string;

  @IsNotEmpty({ message: 'El tipo de usuario es requerido' })
  @IsString({ message: 'El tipo de usuario debe ser un string' })
  @Matches(/(SUPER||DOCTOR|PACIENTE)/, {
    message: 'El tipo de usuario debe ser valido',
  })
  @ApiProperty({ example: 'ADMIN' })
  role: string;

  @IsOptional()
  @IsString({ message: 'El username debe ser un string' })
  @ApiProperty({ example: 'Cesar' })
  username?: string;

  active?: boolean;

  @IsOptional()
  @IsString({ message: 'El doctor debe ser un string' })
  @ApiProperty({ example: 'Cesar' })
  doctor?: string;

  @IsOptional()
  @IsString({ message: '' })
  @ApiProperty({ example: '0412441414' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser un string' })
  @ApiProperty({ example: '' })
  image?: string;

  @IsOptional()
  @IsString({ message: '' })
  @ApiProperty({ example: '' })
  address?: string;

  @IsOptional()
  @ApiProperty({ example: false })
  is_verified?: boolean;

  @IsOptional()
  @ApiProperty({ example: 0 })
  age?: number;

  @IsOptional()
  @ApiProperty({ example: 'Masculino' })
  gender?: string;
}
