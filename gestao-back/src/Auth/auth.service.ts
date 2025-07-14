import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
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
    const existing = await this.authRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(`O e-mail ${dto.email} já está registrado.`);
    }
    const hash = await bcrypt.hash(dto.senha, 10);
    const novoAuth = this.authRepo.create({
      email: dto.email,
      senha: hash,
    });
    return this.authRepo.save(novoAuth);
  }

  async remove(email: string): Promise<void> {
    const authData = await this.authRepo.findOne({
      where: { email },
    });
    if (!authData) {
      throw new Error('Usuário para deleção não encontrado');
    }
    await this.authRepo.remove(authData);
  }

  async update(email: string, dto: UpdateAuthDto) {
    const user = await this.authRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (dto.senha) {
      user.senha = await bcrypt.hash(dto.senha, 10);
    }
    return this.authRepo.save(user);
  }
}
