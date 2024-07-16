import { Module } from '@nestjs/common';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drinks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drink } from './entities/drinks.entity';
import { Tag } from './entities/tags.entity';
import { Ingrediente } from './entities/ingredientes.entity';

@Module({
   imports:[TypeOrmModule.forFeature([Drink,Tag,Ingrediente])],
   controllers: [DrinksController],
   providers:[DrinksService]
})

export class DrinksModule {}
