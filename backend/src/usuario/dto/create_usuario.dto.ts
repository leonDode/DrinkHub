import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUsuarioDTO {
  @ApiProperty({
    example: 'leon'
  })
  @IsString()
  readonly nome: String;

  @ApiProperty({
    example: 'leon@gmail.com'
  })
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly avatarUrl: string;

  @ApiProperty({
    example: 'Teste123-',
    description:
      'deve conter letras maiusculas, minusculas, numeros e simbulos, com um maximo de 20 caracteres e um minimo de 6'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha fraca'
  })
  readonly password: string;
}
