import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Drink } from "./drinks.entity"

@Entity('usuario')
export class Usuario {

    @PrimaryGeneratedColumn()
    id: Number

    @Column({nullable:true})
    nome: String
    
    @Column()
    email: String


    @Column()
    password: String

    @OneToMany(() => Drink, (drink) => drink.usuario)
    drinks: Drink[];

    

}

