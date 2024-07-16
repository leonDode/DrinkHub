import { Injectable, NotFoundException } from '@nestjs/common';
import { Drink } from './entities/drinks.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tags.entity';
import { Ingrediente } from './entities/ingredientes.entity';
import { CreateDrinkDTO } from './dto/create_drink.dto';
import { UpdateDrinkDTO } from './dto/update_drink.dto';
import { UpdateIngredienteDTO } from './dto/update_ingrediente_dto';

@Injectable()
export class DrinksService {

    constructor(
        @InjectRepository(Drink)
        private readonly drinkRepository: Repository<Drink>,

        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,

        @InjectRepository(Ingrediente)
        private readonly ingredienteRepository: Repository<Ingrediente>
    ){}

   
    

    
 


//Tags
    async  findAllTags(){
      return this.tagRepository.find()
  }






//ingredientes
    async  findAllIngredientes(){
      return this.ingredienteRepository.find()
  }

   
  async  findIngredienteByCategoria(categoria:string){
    const ingrediente =  await this.ingredienteRepository.find({
        where: {categoria}
      })
      if(!ingrediente){
        throw new NotFoundException(`o drink  ${categoria} nao existe`)
      }
     return ingrediente
} 
  
//drinks  
    async  findAll(){
      return this.drinkRepository.find({
         relations:['tags','ingredientes'],
        })
      }

    async  findByName(nome:string){
        const drink =  await this.drinkRepository.find({
            where: {nome},
            relations:['tags','ingredientes']
          })
          if(!drink){
            throw new NotFoundException(`o drink  ${nome} nao existe`)
          }
         return drink
    }
 async   findTag(nome:string){
      const drink =  await this.drinkRepository.find({
        where: {tags:{nome}},
        relations:['tags','ingredientes']
      })
      if(!drink){
        throw new NotFoundException(`nao encontrado`)
      }
      return drink
    }


    async   findDrinkByIngrediente(nome:string){
      const drink =  await this.drinkRepository.find({
        where: {ingredientes:{nome}},
        relations:['tags','ingredientes']
      })
      if(!drink){
        throw new NotFoundException(`nao encontrado`)
      }
      return drink
    }

    


    async   findOne(id:number){
      const drink =  await this.drinkRepository.findOne({
        where: {id},
        relations:['tags','ingredientes']
      })
      if(!drink){
        throw new NotFoundException(`o drink com ID ${id} nao existe`)
      }
      return drink
    }

    
    async   findSavedDrink(){
      const drink =  await this.drinkRepository.find({
        where: {salvo: true},
        relations:['tags','ingredientes']
      })
      if(!drink){
        throw new NotFoundException(`o drink com  nao existe`)
      }
      return drink
    }




     
    async findMyBar() {
      const drinks = await this.drinkRepository.find({
        relations: ['tags', 'ingredientes']
      });
    
      const filteredDrinks = drinks.filter(drink =>
        drink.ingredientes.some(ingrediente => ingrediente.salvo === true)
      );
    
      if (filteredDrinks.length === 0) {
        throw new NotFoundException('Nenhum drink com ingredientes salvos foi encontrado');
      }
      
      return filteredDrinks;
    }

    async findMyBarTags(nome:string) {
      const drinks = await this.drinkRepository.find({
        where: {tags:{nome}},
        relations: ['tags', 'ingredientes']
      });
    
      const filteredDrinks = drinks.filter(drink =>
        drink.ingredientes.some(ingrediente => ingrediente.salvo === true)
      );
    
      if (filteredDrinks.length === 0) {
        throw new NotFoundException('Nenhum drink com ingredientes salvos foi encontrado');
      }
      
      return filteredDrinks;
    }



    async   create(createDrinkDTO:CreateDrinkDTO){
      const tags = await Promise.all(
        createDrinkDTO.tags.map(nome=> this.preloadTagByName(nome)),
      )

      const ingredientes = await Promise.all(
        createDrinkDTO.ingredientes.map(nome=> this.preloadIngredienteByName(nome)),
      )
      const drink = this.drinkRepository.create({
        ...createDrinkDTO,
        tags,
        ingredientes
      })
      return this.drinkRepository.save(drink)
        
    }


    async  update(id:number ,updateDrinkDTO:UpdateDrinkDTO){

      const tags = updateDrinkDTO.tags && await Promise.all(
        updateDrinkDTO.tags.map(nome=> this.preloadTagByName(nome)),
      )

      const ingredientes = updateDrinkDTO.ingredientes && await Promise.all(
        updateDrinkDTO.tags.map(nome=> this.preloadIngredienteByName(nome)),
      )



      const drink = await this.drinkRepository.preload({
        ...updateDrinkDTO,
        id,
        tags,
        ingredientes
      })
       if(!drink){
        throw new NotFoundException(`o drink com ID ${id} nao existe`)
       }
       return this.drinkRepository.save(drink)
    }


    
    async  updateIngrediente(id:number ,updateIngrediente:UpdateIngredienteDTO){

      

     


      const ingrediente = await this.ingredienteRepository.preload({
        ...updateIngrediente,
        id,
      })
       if(!ingrediente){
        throw new NotFoundException(`o ingrediente com ID ${id} nao existe`)
       }
       return this.ingredienteRepository.save(ingrediente)
    }
    




    async   remove(id:number ){
        const drink = await this.drinkRepository.findOne({
           where: {id}
          })
          if(!drink){
            throw new NotFoundException(`o drink com ID ${id} nao existe`)
           }
           return this.drinkRepository.remove(drink)

       
    }

    private async preloadTagByName(nome: string): Promise<Tag> {
      const tag = await this.tagRepository.findOne({ where: { nome } })
      if (tag) {
        return tag
      }
      return this.tagRepository.create({ nome })
    }

    private async preloadIngredienteByName(nome: string): Promise<Ingrediente> {
      const ingrediente = await this.ingredienteRepository.findOne({ where: { nome } })
      if (ingrediente) {
        return ingrediente
      }
      return this.ingredienteRepository.create({ nome })
    }





}
