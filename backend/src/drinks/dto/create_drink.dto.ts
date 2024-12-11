import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDrinkDTO {
  @ApiProperty({
    example: 'caipirinha'
  })
  @IsString()
  readonly nome: String;

  @ApiProperty({
    example:
      'A Caipirinha é um coquetel clássico brasileiro, famoso por sua simplicidade e sabor refrescante. Feita com cachaça, açúcar, limão fresco e gelo, a bebida equilibra o doce e o cítrico, realçando o sabor característico da cachaça. É tradicionalmente servida em copos baixos e é ideal para dias quentes, simbolizando o espírito vibrante e descontraído do Brasil.'
  })
  @IsString()
  readonly descricao: string;

  @ApiProperty({
    example:
      'Corte o limão: Lave bem o limão e corte-o em quatro partes. Remova o miolo branco central para evitar amargor. Macere o limão: Coloque os pedaços de limão em um copo e adicione o açúcar. Usando um pilão, macere suavemente o limão com o açúcar até extrair o suco, misturando bem os sabores. Adicione a cachaça: Despeje a cachaça no copo com o limão e o açúcar.complete com gelo: Adicione bastante gelo ao copo e mexa bem.Sirva: Sua caipirinha está pronta! Aprecie a bebida imediatamente para aproveitar a refrescância.'
  })
  @IsString()
  readonly instrucoes: string;

  @ApiProperty({
    example: ['doce', 'citrico']
  })
  @IsString({ each: true })
  readonly tags: string[];

  @ApiProperty({
    example: ['cachaça', 'limão', 'açucar']
  })
  @IsString({ each: true })
  readonly ingredientes: string[];

  @ApiProperty({
    example: '60ml'
  })
  @IsString()
  readonly medidas0?: string;

  @ApiProperty({
    example: '30ml'
  })
  @IsOptional()
  @IsString()
  readonly medidas1?: string | null;

  @ApiProperty({
    example: '10g'
  })
  @IsOptional()
  @IsString()
  readonly medidas2?: string | null;

  @ApiProperty({
    example: null
  })
  @IsOptional()
  @IsString()
  readonly medidas3?: string | null;

  @ApiProperty({
    example: null
  })
  @IsOptional()
  @IsString()
  readonly medidas4?: string | null;

  @ApiProperty({
    example: false
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  readonly salvo: boolean;

  @ApiProperty({
    example: true
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  readonly publico: boolean;

  @ApiProperty({
    example: 1
  })
  @IsInt()
  @IsOptional()
  readonly usuarioId?: number;
}
