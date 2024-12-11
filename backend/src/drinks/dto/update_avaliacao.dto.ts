import { PartialType } from '@nestjs/swagger';
import { CreateAvaliacaoDTO } from './create_avaliacao.dto';

export class UpdateAvalicaoDTO extends PartialType(CreateAvaliacaoDTO) {}
