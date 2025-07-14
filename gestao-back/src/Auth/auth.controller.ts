/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Delete,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // Este método agora usa o LoginDto importado, que contém os decorators de validação.
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto.email, dto.senha);
    if (!result) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return result;
  }

  @Post('register')
  async create(@Body() dto: CreateAuthDto) {
    const user = await this.authService.create(dto);
    const resposta = { ...user } as any;
    delete resposta.senha;
    return resposta;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Req() req) {
    const email = req.user.email;
    await this.authService.remove(email);
    return {
      email: email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Req() req, @Body() dto: UpdateAuthDto) {
    if ('email' in dto) {
      throw new BadRequestException('Atualização do email não é permitida');
    }
    const email = req.user.email;
    const saved = await this.authService.update(email, dto);
    return {
      email: saved.email,
    };
  }
}
