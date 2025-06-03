import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthData } from './entity/auth-data.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthData])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
