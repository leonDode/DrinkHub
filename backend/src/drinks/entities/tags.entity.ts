import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Drink } from "./drinks.entity"

@Entity('tags')
export class Tag {

    @PrimaryGeneratedColumn()
    id: Number

    @Column()
    nome: String
    
    @Column({nullable:true})
    color: String


    @Column({nullable:true})
    imgTag: String

    @ManyToMany(()=> Drink,drink=>drink.tags)
    drinks: Drink[]

    

}

