import { PartialType } from '@nestjs/swagger';
import { CreateDrinkDTO } from './create_drink.dto';

export class UpdateDrinkDTO extends PartialType(CreateDrinkDTO) {}
