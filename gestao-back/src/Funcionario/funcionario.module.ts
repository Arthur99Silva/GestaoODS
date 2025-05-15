import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FuncionarioController } from "./funcionario.controller";
import { FuncionarioService } from "./funcionario.service";
import { Funcionario } from "./entite/funcionario.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Funcionario])],
    controllers: [FuncionarioController],
    providers: [FuncionarioService],
})
export class FuncionarioModule {}
