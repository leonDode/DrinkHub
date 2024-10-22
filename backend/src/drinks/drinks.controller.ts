import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { DrinksService } from './drinks.service';
import { CreateDrinkDTO } from './dto/create_drink.dto';
import { UpdateDrinkDTO } from './dto/update_drink.dto';
import { CreateIngredienteDTO } from './dto/create_ingrediente_dto';
import { UpdateIngredienteDTO } from './dto/update_ingrediente_dto';


@Controller('drinks')
export class DrinksController {


constructor(private readonly drinkService:DrinksService){
}


  @Get()
    findAll(){
        return this.drinkService.findAll()

    }
    @Get('/mybar')
    findMyBar(){
        return this.drinkService.findMyBar()

    }

    @Get('/mybar/:tags')
    findMyBarTags(@Param('tags') nome:string){
        return this.drinkService.findMyBarTags(nome)

    }

    @Get('/ingredientes')
    findAllIngrediente(){
        return this.drinkService.findAllIngredientes()

    }


    @Get('/ingredientes/:categoria')
    findIngredienteByCategoria(@Param('categoria') categoria:string){
        return this.drinkService.findIngredienteByCategoria(categoria)

    }

    @Get('/categorias')
    findAllTags(){
        return this.drinkService.findAllTags()

    }

    @Get('/tags/:nome')
     findTag(@Param('nome') nome:string){
        return this.drinkService.findTag(nome)

    }
    @Get('/salvos')
     findSavedDrink(){
        return this.drinkService.findSavedDrink()

    }

    @Get('/componentes/:nome')
    findDrinkByIngrediente(@Param('nome') nome:string){
        return this.drinkService.findDrinkByIngrediente(nome)

    }



    @Get(':id')
    findOne(@Param('id') id:number){
        return this.drinkService.findOne(id)

    }


    @Get('/pesqNome/:name')
    findByName(@Param('name') nome:string){
        return this.drinkService.findByName(nome)


    }


    @Post()
    createDrink(@Body() createDrinkDTO:CreateDrinkDTO){
        return this.drinkService.create(createDrinkDTO)

    }

    @Put(':id')
     updateDrinks(@Param('id') id:number, @Body() updateDrinkDTO:UpdateDrinkDTO){

        return this.drinkService.update(id,updateDrinkDTO)
     }


     @Put('/ingredientes/:id')
     updateIngredientes(@Param('id') id:number, @Body() updateingredienteDTO:UpdateIngredienteDTO){

        return this.drinkService.updateIngrediente(id,updateingredienteDTO)
     }


     @HttpCode(204)
     @Delete(':id')
     deleteDrinks(@Param('id') id:number){


        return this.drinkService.remove(id)
     }


     @Get('/user/:id')
     findCreatedByUser(@Param('id') id:number){
         return this.drinkService.findCreatedByUser(id)
 
     }
}
