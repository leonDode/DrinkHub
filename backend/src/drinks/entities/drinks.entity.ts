import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Tag } from "./tags.entity"
import { Ingrediente } from "./ingredientes.entity"
import { Usuario } from "./usuario.entity"

@Entity('drinks')
export class Drink {

    @PrimaryGeneratedColumn()
    id: Number

    @Column()
    nome: String

    @Column()
    descricao: string

    @Column({nullable:true})
    instrucoes: string


    @Column()
    img: String



    @JoinTable()
    @ManyToMany(()=> Tag,tag =>tag.drinks,{
        cascade:true
    })
    tags: Tag[]


    @JoinTable()
    @ManyToMany(()=> Ingrediente,ingrediente =>ingrediente.drinks,{
        cascade: true
    })
    ingredientes: Ingrediente[]


    @Column({ nullable: true })
    medidas0: string

    @Column({ nullable: true })
    medidas1: string

    @Column({ nullable: true })
    medidas2: string

    @Column({ nullable: true })
    medidas3: string

    @Column({ nullable: true })
    medidas4: string

    @Column({default: false})
    salvo: boolean

   @ManyToOne(() => Usuario, (usuario) => usuario.drinks)
   usuario: Usuario;

    @Column({default: true})
    publico: boolean
}

