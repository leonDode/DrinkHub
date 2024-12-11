import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drink } from 'src/drinks/entities/drinks.entity';
import { Usuario } from 'src/drinks/entities/usuario.entity';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';


@Module({
   imports:[TypeOrmModule.forFeature([Usuario,Drink])],
   controllers: [UsuarioController],
   providers:[UsuarioService],
   exports: [UsuarioService]
})


export class UsuarioModule {}

