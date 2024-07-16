import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateDrinkDTO{


    
    
    @ApiProperty({
        description:"nome do drink",
        example: "caipirinha"
    })
    @IsString()
    readonly nome: String

    @ApiProperty({
        description:"descreve o drink em questao",
        example: "o drink nacional mais forte do brasil.Segundo historiadores, a caipirinha, como é conhecida hoje,foi inventada por fazendeiros latifundiários da região de piracicaba, durante o século XIX, como bebida local para eventos e festas de alto padrão, sendo um reflexo da forte cultura da cana-de-açúcar na região"
    })
    @IsString()
    readonly descricao: string

    @ApiProperty({
        description:"intrucoes para fazer o drink",
        example: "1 - Pegue o limão coloque-o na horizontal e retire as duas pontas, vire-o na vertical e corte-o ao meio, retire os meio (parte branca) do limão e fatie ...."
    })
    @IsString()
    readonly instrucoes: string

    @ApiProperty({
        description:"tags relacionadas com esse drink",
        example: ["doce","cítrico"]
    })
    @IsString({ each: true })
    readonly tags: string[]
 
    @ApiProperty({
        description:"ingredientes relacinados com o drink",
        example: ["Cachaca","Limao-Taiti","Açucar"]
    })
    @IsString({ each: true })
    readonly ingredientes: string[]

    @ApiProperty({
        description:"medida para o primeiro ingrediente do drink (pode ser nulo)",
        example: "50 ml"
    })
    @IsString()
    readonly medidas0: string

    @ApiProperty({
        description:"medida para o segundo ingrediente do drink (pode ser nulo)",
        example: "1 limao"
    })
    @IsOptional()
    @IsString()
    readonly medidas1: string | null

    @ApiProperty({
        description:"medida para o terceiro ingrediente do drink (pode ser nulo)",
        example: "20 g"
    })
    @IsOptional()
    @IsString()
    readonly medidas2: string | null

    @ApiProperty({
        description:"medida para o quarto ingrediente do drink (pode ser nulo)",
        example: null
    })
    @IsOptional()
    @IsString()
    readonly medidas3: string | null

    @ApiProperty({
        description:"medida para o quinto ingrediente do drink (pode ser nulo)",
        example: null
    })
    @IsOptional()
    @IsString()
    readonly medidas4: string | null
 
    @ApiProperty({
        description:"define se o drink foi salvo ou nao",
        example: true
    })
    @IsBoolean()
    readonly salvo: boolean

    @ApiProperty({
        description:"imagem do drink",
        example: "https://leondode.github.io/api-drinks-fotos/DrinksImg/caipirinha.png"
    })
    @IsString()
    readonly img: String
}