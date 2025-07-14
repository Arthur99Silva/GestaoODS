import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config'; // Importante para carregar as variáveis

export const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST as string, // <-- CORREÇÃO AQUI
  port: parseInt(process.env.DB_PORT as string, 10), // <-- CORREÇÃO AQUI
  username: process.env.DB_USERNAME as string, // <-- CORREÇÃO AQUI
  password: process.env.DB_PASSWORD as string, // <-- CORREÇÃO AQUI
  database: process.env.DB_DATABASE as string, // <-- CORREÇÃO AQUI
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  ssl: process.env.DB_HOST !== 'localhost',
  extra: {
    ssl:
      process.env.DB_HOST !== 'localhost'
        ? { rejectUnauthorized: false }
        : null,
  },
};