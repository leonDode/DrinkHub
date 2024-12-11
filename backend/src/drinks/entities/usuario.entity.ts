import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Drink } from './drinks.entity';
import { Avaliacao } from './avaliacao.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({ nullable: true })
  nome: String;

  @Column()
  email: String;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  password: String;

  @OneToMany(() => Drink, (drink) => drink.usuario)
  drinks: Drink[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.usuario)
  avaliacoes: Avaliacao[];
}
