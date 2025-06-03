// src/app/components/product-management/product-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicionado OnDestroy
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl // Adicionado FormControl
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService, Product, Supplier } from '../../services/api.service';
import { Subject } from 'rxjs'; // Adicionado Subject
import { takeUntil, debounceTime } from 'rxjs/operators'; // Adicionado takeUntil, debounceTime

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  filterForm: FormGroup; // Formulário para os filtros
  
  allProducts: Product[] = []; // Guarda todos os produtos carregados
  filteredProducts: Product[] = []; // Produtos a serem exibidos na tabela
  suppliers: Supplier[] = [];
  
  displayedColumns: string[] = ['nome_produto', 'qtd_produto', 'valor_custo', 'valor_venda', 'fornecedor', 'actions'];
  editingProductId: number | null = null;

  private destroy$ = new Subject<void>(); // Para gerenciar subscriptions

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      nome_produto: ['', Validators.required],
      qtd_produto: ['', [Validators.required, Validators.min(0)]],
      valor_custo: ['', [Validators.required, Validators.min(0)]],
      valor_venda: ['', [Validators.required, Validators.min(0)]],
      fk_cpf_cnpj_fornecedor: ['', Validators.required]
    });

    // Inicializa o formulário de filtros
    this.filterForm = this.fb.group({
      nomeProdutoFilter: [''],
      fornecedorFilter: ['']
    });
  }

  ngOnInit(): void {
    this.loadSuppliers(); // Carrega fornecedores primeiro para o mapeamento de nome
    this.loadProducts();
    this.setupFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.api.getProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilters(); // Aplica filtros assim que os produtos são carregados
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.snackBar.open('Erro ao carregar produtos.', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadSuppliers(): void {
    this.api.getSuppliers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.suppliers = data;
        // Se os produtos já foram carregados, reaplica os filtros pois agora temos os nomes dos fornecedores
        if (this.allProducts.length > 0) {
            this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar fornecedores:', err);
        this.snackBar.open('Erro ao carregar fornecedores.', 'Fechar', { duration: 3000 });
      }
    });
  }

  setupFilters(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(300), // Adiciona um pequeno delay para não filtrar a cada tecla digitada
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const { nomeProdutoFilter, fornecedorFilter } = this.filterForm.value;
    const nomeProdutoFilterLower = nomeProdutoFilter?.toLowerCase() || '';
    const fornecedorFilterLower = fornecedorFilter?.toLowerCase() || '';

    this.filteredProducts = this.allProducts.filter(product => {
      const matchesNomeProduto = nomeProdutoFilterLower 
        ? product.nome_produto.toLowerCase().includes(nomeProdutoFilterLower) 
        : true;

      const supplierName = this.getSupplierName(product.fk_cpf_cnpj_fornecedor).toLowerCase();
      const matchesFornecedor = fornecedorFilterLower 
        ? supplierName.includes(fornecedorFilterLower) || product.fk_cpf_cnpj_fornecedor.includes(fornecedorFilterLower)
        : true;
        
      return matchesNomeProduto && matchesFornecedor;
    });
  }
  
  clearFilters(): void {
    this.filterForm.reset({ nomeProdutoFilter: '', fornecedorFilter: '' });
    // applyFilters() será chamado automaticamente pelo valueChanges
  }


  onSubmit(): void {
    if (this.productForm.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    const productData = this.productForm.value;
    console.log(productData);
    if (this.editingProductId !== null) {
      this.api.updateProduct(this.editingProductId, productData).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.resetFormAndReload();
        },
        error: (err) => this.handleApiError(err, 'atualizar')
      });
    } else {
      this.api.createProduct(productData).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open('Produto cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          this.resetFormAndReload();
        },
        error: (err) => this.handleApiError(err, 'cadastrar')
      });
    }
  }
  
  resetFormAndReload(): void {
    this.resetForm();
    this.loadProducts(); // Recarrega os produtos e aplica filtros
  }

  handleApiError(err: any, action: string): void {
    console.error(`Erro ao ${action} produto:`, err);
    this.snackBar.open(`Erro ao ${action} produto.`, 'Fechar', { duration: 3000 });
  }

  editProduct(product: Product): void {
    if (product.id_produto === undefined) {
        console.error('Produto sem ID não pode ser editado.');
        this.snackBar.open('Produto sem ID não pode ser editado.', 'Fechar', {duration: 3000});
        return;
    }
    this.editingProductId = product.id_produto;
    this.productForm.patchValue(product);
    window.scrollTo(0, 0); // Rola para o topo para ver o formulário de edição
  }

  deleteProduct(id_produto: number | undefined): void {
    if (id_produto === undefined) {
        this.snackBar.open('ID do produto inválido para exclusão.', 'Fechar', {duration: 3000});
        return;
    }
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.api.deleteProduct(id_produto).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 });
          if (this.editingProductId === id_produto) {
            this.resetForm();
          }
          this.loadProducts(); // Recarrega os produtos e aplica filtros
        },
        error: (err) => this.handleApiError(err, 'excluir')
      });
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.editingProductId = null;
    Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.setErrors(null) ;
        this.productForm.get(key)?.markAsUntouched();
        this.productForm.get(key)?.markAsPristine();
    });
  }

  getSupplierName(cpf_cnpj: string): string {
    const supplier = this.suppliers.find(s => s.cpf_cnpj_fornecedor === cpf_cnpj);
    return supplier ? supplier.nome_fornecedor : cpf_cnpj; // Retorna CPF/CNPJ se nome não encontrado
  }
}