
import { PartialType } from '@nestjs/mapped-types'
import { CreateIngredienteDTO } from './create_ingrediente_dto'

export class UpdateIngredienteDTO extends PartialType(CreateIngredienteDTO) {

}