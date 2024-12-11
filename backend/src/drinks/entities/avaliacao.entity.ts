// src/avaliacoes/avaliacao.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique
} from 'typeorm';
import { Drink } from './drinks.entity';
import { Usuario } from './usuario.entity';

@Entity()
@Unique(['usuario', 'drink'])
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  nota: number;

  @Column({ nullable: true })
  comentario: string;

  @ManyToOne(() => Drink, (drink) => drink.avaliacoes)
  drink: Drink;

  @ManyToOne(() => Usuario, (usuario) => usuario.avaliacoes)
  usuario: Usuario;
}
