import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateDrinkDTO{


    
    
    
    @IsString()
    readonly nome: String

    @IsString()
    readonly descricao: string

    @IsString()
    readonly instrucoes: string

    @IsString({ each: true })
    readonly tags: string[]
    
    @IsString({ each: true })
    readonly ingredientes: string[]

    @IsString()
    readonly medidas0: string

    @IsString()
    @IsOptional()
    readonly medidas1?: string

    @IsString()
    @IsOptional()
    readonly medidas2?: string

    @IsString()
    @IsOptional()
    readonly medidas3?: string

    @IsString()
    @IsOptional()
    readonly medidas4?: string
    
    @IsBoolean()
    readonly salvo: boolean

    @IsBoolean()
    readonly publico: boolean | true

    @IsString()
    readonly img: String

    @IsInt()
    @IsOptional() 
    readonly usuarioId?: number
}