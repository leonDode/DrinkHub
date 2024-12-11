import { Module } from '@nestjs/common';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drinks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drink } from './entities/drinks.entity';
import { Tag } from './entities/tags.entity';
import { Ingrediente } from './entities/ingredientes.entity';
import { Usuario } from './entities/usuario.entity';
import { Avaliacao } from './entities/avaliacao.entity';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drink, Tag, Ingrediente, Avaliacao, Usuario])
  ],
  controllers: [DrinksController],
  providers: [DrinksService, UploadService]
})
export class DrinksModule {}
