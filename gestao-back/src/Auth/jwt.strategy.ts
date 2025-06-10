// Em src/Auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'segredo_super_secreto',
    });
  }

  // Esta função é chamada automaticamente pelo Passport após ele validar o token.
  // O 'payload' é o conteúdo decodificado do token (ex: { email: '...' }).
  async validate(payload: any) {
    // Você pode adicionar lógicas aqui, como buscar o usuário completo no banco.
    // Para este caso, apenas retornar o payload é suficiente.
    return { email: payload.email };
  }
}