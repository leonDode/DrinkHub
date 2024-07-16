import { IsBoolean, IsString } from 'class-validator'


export class CreateIngredienteDTO{



    @IsString()
    readonly nome: String

    @IsString()
    readonly img_ingrediente: String


    @IsString()
    readonly categoria: String


    @IsBoolean()
    readonly salvo: boolean


}