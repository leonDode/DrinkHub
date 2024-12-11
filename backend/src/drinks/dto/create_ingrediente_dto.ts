import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateIngredienteDTO {
  @ApiProperty({
    example: 'cachaca'
  })
  @IsString()
  readonly nome: String;

  @IsString()
  readonly img_ingrediente: String;

  @ApiProperty({
    example: 'destilados'
  })
  @IsString()
  readonly categoria: String;

  @IsBoolean()
  readonly salvo: boolean;
}
