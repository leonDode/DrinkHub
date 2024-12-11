import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/drinks/entities/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioDTO } from './dto/create_usuario.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDTO } from './dto/update_usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) {}

  async create(createUserDto: CreateUsuarioDTO) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const usuario = this.usuarioRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    const createdUser = await this.usuarioRepository.save(usuario);

    delete createdUser.password;

    return createdUser;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDTO) {
    const usuario = await this.usuarioRepository.preload({
      id,
      ...updateUsuarioDto
    });

    if (!usuario) {
      throw new NotFoundException(`O usuário com ID ${id} não existe`);
    }

    return this.usuarioRepository.save(usuario);
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`o usuario com ID ${id} nao existe`);
    }
    return usuario;
  }

  async findByEmail(email: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new NotFoundException(`o usuario com  email '${email}' nao existe`);
    }
    return usuario;
  }

  async findByName(nome: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { nome } });
    if (!usuario) {
      throw new NotFoundException(`o usuario com  nome '${nome}' nao existe`);
    }
    return usuario;
  }
  async findAllUsers() {
    return this.usuarioRepository.find();
  }
}
