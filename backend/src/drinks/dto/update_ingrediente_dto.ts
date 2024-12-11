import { PartialType } from '@nestjs/swagger';
import { CreateIngredienteDTO } from './create_ingrediente_dto';

export class UpdateIngredienteDTO extends PartialType(CreateIngredienteDTO) {}
