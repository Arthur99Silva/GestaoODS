import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthData } from './entity/auth-data.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthData)
    private authRepo: Repository<AuthData>,
  ) {}

  async login(email: string, senha: string): Promise<{ token: string }> {
    const user = await this.authRepo.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaOK = await bcrypt.compare(senha, user.senha);
    if (!senhaOK) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { email: user.email };
    const token = jwt.sign(payload, 'segredo_super_secreto', {
      expiresIn: '1h',
    });

    return { token };
  }

  async create(dto: CreateAuthDto): Promise<AuthData> {
    const hash = await bcrypt.hash(dto.senha, 10);
    const novoAuth = this.authRepo.create({
      email: dto.email,
      senha: hash,
    });
    return this.authRepo.save(novoAuth);
  }

  async remove(email_retirado: string, senha_retirada: string): Promise<void> {
    const authData = await this.authRepo.findOne({
      where: { email: email_retirado, senha: senha_retirada },
    });
    if (!authData) {
      throw new Error('Email para deleção não encontrado');
    }
    await this.authRepo.remove(authData);
  }

  async update(
    email_var: string,
    senha_var: string,
    dto: UpdateAuthDto,
  ): Promise<AuthData> {
    const forma = await this.authRepo.findOne({
      where: { email: email_var, senha: senha_var },
    });
    if (!forma) {
      throw new NotFoundException('Usuário para update inválido');
    }
    const updated = Object.assign(forma, dto);
    return this.authRepo.save(updated);
  }
}
