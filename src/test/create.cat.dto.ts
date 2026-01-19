import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateCatDto {
    @IsUUID()
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id:string;
    
    @IsNotEmpty()
    @ApiProperty({ example: 'jenny' })
    name: string;

    @IsNotEmpty()
    @ApiProperty({ example: 2 })
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @ApiProperty({ example: 'jenny' })
    breed: string;
}