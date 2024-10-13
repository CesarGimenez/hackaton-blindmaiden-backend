import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAppointmentDto {
    @ApiProperty({ example: new Date() })
    @IsNotEmpty({ message: 'La fecha es requerida' })
    date: Date;

    @ApiProperty({ example: '10:00' })
    @IsNotEmpty({ message: 'El horario es requerido' })
    time: string;

    @ApiProperty({ example: 'Consulta' })
    @IsOptional()
    description: string;

    @ApiProperty({ example: 'Consulta' })
    @IsNotEmpty({ message: 'El tipo de consulta es requerido' })
    type: string;

    @ApiProperty({ example: '' })
    @IsOptional()
    patient: string;

    @ApiProperty({ example: '' })
    @IsOptional()
    doctor: string;

    @ApiProperty({ example: 'pending' })
    @IsOptional({ message: 'El estado es requerido' })
    status: string;
}
