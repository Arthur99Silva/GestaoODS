import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { Empresa } from './entity/empresa.entity';
import { AuthModule } from 'src/Auth/auth.module'; // 1. IMPORTE O AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa]), // 
    AuthModule, // 2. ADICIONE O AuthModule AOS IMPORTS
  ],
  controllers: [EmpresaController], // 
  providers: [EmpresaService], // 
})
export class EmpresaModule {} //