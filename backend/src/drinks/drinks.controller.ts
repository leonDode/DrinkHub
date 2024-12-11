import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { DrinksService } from './drinks.service';
import { CreateDrinkDTO } from './dto/create_drink.dto';
import { UpdateDrinkDTO } from './dto/update_drink.dto';
import { UpdateIngredienteDTO } from './dto/update_ingrediente_dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateAvaliacaoDTO } from './dto/create_avaliacao.dto';

@Controller('drinks')
export class DrinksController {
  constructor(private readonly drinkService: DrinksService) {}

  // find all
  @ApiTags('Drinks')
  @Get()
  async findAll() {
    return await this.drinkService.findAll();
  }

  // create
  @ApiTags('Drinks')
  @Post()
  // eslint-disable-next-line prettier/prettier
  async createDrink(@Body() createDrinkDTO: CreateDrinkDTO) {
    return await this.drinkService.create(createDrinkDTO);
  }

  // update
  @ApiTags('Drinks')
  @Put(':id')
  async updateDrinks(
    @Param('id') id: number,
    @Body() updateDrinkDTO: UpdateDrinkDTO
  ) {
    return await this.drinkService.update(id, updateDrinkDTO);
  }

  // delete
  @ApiTags('Drinks')
  @HttpCode(204)
  @Delete(':id')
  deleteDrinks(@Param('id') id: number) {
    return this.drinkService.remove(id);
  }

  // find {id}
  @ApiTags('Drinks')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.drinkService.findOne(id);
  }
  // find{nome}
  @ApiTags('Drinks')
  @Get('/pesqNome/:name')
  findByName(@Param('name') nome: string) {
    return this.drinkService.findByName(nome);
  }

  // frind drink {ingrediente}
  @ApiTags('Drinks')
  @Get('/componentes/:nome')
  findDrinkByIngrediente(@Param('nome') nome: string) {
    return this.drinkService.findDrinkByIngrediente(nome);
  }

  // list drinks salvos
  @ApiTags('Drinks')
  @Get('/pesqSalvos/salvos')
  findSavedDrink() {
    return this.drinkService.findSavedDrink();
  }

  // list MyBar
  @ApiTags('Drinks')
  @Get('/pesqMybar/mybar')
  findMyBar() {
    return this.drinkService.findMyBar();
  }

  // find MyBar {tag}
  @ApiTags('Drinks')
  @Get('/mybar/:tags')
  findMyBarTags(@Param('tags') nome: string) {
    return this.drinkService.findMyBarTags(nome);
  }

  // find all ingredientes
  @ApiTags('Ingredientes')
  @Get('/pesqIng/ingredientes')
  findAllIngrediente() {
    return this.drinkService.findAllIngredientes();
  }

  // find ingrediente {categoria}
  @ApiTags('Ingredientes')
  @Get('/ingredientes/:categoria')
  findIngredienteByCategoria(@Param('categoria') categoria: string) {
    return this.drinkService.findIngredienteByCategoria(categoria);
  }
  //update ingrediente
  @ApiTags('Ingredientes')
  @Put('/ingredientes/:id')
  updateIngredientes(
    @Param('id') id: number,
    @Body() updateingredienteDTO: UpdateIngredienteDTO
  ) {
    return this.drinkService.updateIngrediente(id, updateingredienteDTO);
  }

  //find all tags
  @ApiTags('Tags')
  @Get('/pesqTag/tags')
  findAllTags() {
    return this.drinkService.findAllTags();
  }

  // find tags {nome}
  @ApiTags('Tags')
  @Get('/pesqTag/tags/:nome')
  findTag(@Param('nome') nome: string) {
    return this.drinkService.findTag(nome);
  }

  @ApiTags('Drinks')
  @Get('/user/:id')
  findCreatedByUser(@Param('id') id: number) {
    return this.drinkService.findCreatedByUser(id);
  }

  @ApiTags('Avaliações')
  @Get('/media/:drinkId')
  async obterMedia(@Param('drinkId') drinkId: number) {
    return await this.drinkService.drinkAvaliacaoMedia(drinkId);
  }

  @ApiTags('Avaliações')
  @Post('/avaliacoes')
  async createAvaliacao(@Body() createAvaliacaoDto: CreateAvaliacaoDTO) {
    return this.drinkService.createAvalaicao(createAvaliacaoDto);
  }

  @ApiTags('Avaliações')
  @Get('/avaliacoes/:usuarioId/:drinkId')
  async findUserAvaliacao(
    @Param('usuarioId') usuarioId: number,
    @Param('drinkId') drinkid: number
  ) {
    return this.drinkService.findUserAval(usuarioId, drinkid);
  }

  @ApiTags('Avaliações')
  @Get('/avaliacoes/:drinkId')
  async findAllAvalForSelectDrink(@Param('drinkId') drinkid: number) {
    return this.drinkService.findallAvalForSelectDrink(drinkid);
  }
}
