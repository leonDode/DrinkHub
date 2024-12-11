import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drink } from 'src/drinks/entities/drinks.entity';
import { Ingrediente } from 'src/drinks/entities/ingredientes.entity';
import { Tag } from 'src/drinks/entities/tags.entity';
import { Usuario } from 'src/drinks/entities/usuario.entity';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Avaliacao } from 'src/drinks/entities/avaliacao.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Drink, Tag, Ingrediente, Avaliacao, Usuario],
  synchronize: true
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...dataSourceOptions
        };
      }
    })
  ]
})
export class DatabaseModule {}
