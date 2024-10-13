import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsString({ message: 'El email debe ser un string' })
  @IsEmail()
  @ApiProperty({ example: 'Pb3Jt@example.com' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser un string' })
  @ApiProperty({ example: '123456' })
  password: string;
}
