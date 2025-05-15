import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormaPagamento } from 'src/Forma_Pagamento/entite/forma-pagamento.entity';

@Injectable()
export class FormaPagamentoSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(FormaPagamento)
    private readonly formaPagamentoRepository: Repository<FormaPagamento>,
  ) {}

  async onModuleInit() {
    const count = await this.formaPagamentoRepository.count();
    if (count === 0) {
      await this.formaPagamentoRepository.insert([
        { id_forma_pagamento: 1, nome_forma_pagamento: 'Dinheiro' },
        { id_forma_pagamento: 2, nome_forma_pagamento: 'Cartão de Crédito' },
        { id_forma_pagamento: 3, nome_forma_pagamento: 'Cartão de Débito' },
        { id_forma_pagamento: 4, nome_forma_pagamento: 'PIX' },
        { id_forma_pagamento: 5, nome_forma_pagamento: 'Cheque' },
      ]);
      console.log('Dados iniciais inseridos na tabela FormaPagamento!');
    }
  }
}
