import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      secret: 'teste',
      signOptions: { expiresIn: '30d' }
    }),
    ConfigModule.forFeature(googleOauthConfig)
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy]
})
export class AuthModule {}
