import { Injectable } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/drinks/entities/usuario.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { CreateUsuarioDTO } from 'src/usuario/dto/create_usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Usuario> {
    const usuario = await this.usuarioService.findByEmail(email);

    if (usuario) {
      const isPasswordValid = await bcrypt.compare(password, usuario.password);

      if (isPasswordValid) {
        return {
          ...usuario,
          password: undefined
        };
      }
      throw new Error('Email ou senha incorreta ');
    }
  }

  login(user: Usuario): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      nome: user.nome
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      acess_token: jwtToken,
      user_id: user.id
    };
  }

  async validateGoogleUser(googleUser: CreateUsuarioDTO) {
    const user = await this.usuarioService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.usuarioService.create(googleUser);
  }
}
