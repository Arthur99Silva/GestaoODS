import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Delete,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get(':email/:senha')
  async login(@Param('email') email: string, @Param('senha') senha: string) {
    const result = await this.authService.login(email, senha);
    if (!result) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return result; //{ token: '...' }
  }

  @Post()
  async create(@Body() dto: CreateAuthDto) {
    return this.authService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':email/:senha')
  async remove(@Param('email') email: string, @Param('senha') senha: string) {
    return this.authService.remove(email, senha);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':email/:senha')
  async update(
    @Param('email') email: string,
    @Param('senha') senha: string,
    @Body() dto: UpdateAuthDto,
  ) {
    return this.authService.update(email, senha, dto);
  }
}
