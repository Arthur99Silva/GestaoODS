import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Delete,
  Param,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const resposta = { ...user } as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete resposta.senha;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return resposta;
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
