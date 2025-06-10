import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthData } from './entity/auth-data.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthData]), 
    PassportModule, 
    JwtModule.register({ 
      secret: 'segredo_super_secreto', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController], //
  providers: [
    AuthService, 
    JwtStrategy, 
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}