import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { ThfTableColumn, ThfPageFilter, ThfModalComponent, ThfComboOption, ThfRadioGroupOption, ThfCheckboxGroupOption, ThfModalAction, ThfDisclaimerGroup } from '@totvs/thf-ui';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  // Url do servidor de exemplo
  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';
  
  // Objetos para consultar os dados e armazenar os clientes
  private clienteSub = Subscription;
  public clientes: Array<any> = [];

  // Controle de loading e paginação
  public hasNext: boolean = false;
  private page: number = 1;
  public loading: boolean = true;

  // Configuração das colunas
  public readonly colunas: Array<ThfTableColumn> = [
    // Definição das colunas
    {property: 'name', label: 'Nome Completo'},
    {property: 'nickname', label: 'Usuário' },
    {property: 'email', label: 'E-mail', type: 'link', action: this.sendMail.bind(this)},
    {property: 'birthdate', label: 'Nascimento', type: 'date', format: 'dd/MM/yyyy' },
    {property: 'genre', label: 'Gênero', type: 'subtitle', width: '80px', subtitles: [
      { value: 'Female', color: 'color-05', content: 'F', label: 'Feminino' },
      { value: 'Male', color: 'color-02', content: 'M', label: 'Masculino' },
      { value: 'Other', color: 'color-08', content: 'O', label: 'Outros' },
    ]},   
    {property: 'city', label: 'Cidade' },
    { property: 'status', type: 'label', labels: [
      { value: 'Active', color: 'success', label: 'Ativo' },
      { value: 'Inactive', color: 'danger', label: 'Inativo' }
    ]},    
  ];


  // Propriedades para busca rápida:
  public searchTerm: string = '';

  public readonly filter: ThfPageFilter = {
    action: this.onActionSearch.bind(this),
    ngModel: 'searchTerm',
    placeholder: 'Pesquisar por ...',
    advancedAction: this.openAdvancedFilter.bind(this),
  }

  //  Propriedades para Busca Avançada
  private searchFilters:any;
  public city: string;
  public genre: string;
  public name: string;
  public status: Array<string> = []; 

  public readonly cityOptions: Array<ThfComboOption> = [
    { label: 'Araquari', value: 'Araquari' },
    { label: 'Belém', value: 'Belém' },
    { label: 'Campinas', value: 'Campinas' },
    { label: 'Curitiba', value: 'Curitiba' },
    { label: 'Joinville', value: 'Joinville' },
    { label: 'Osasco', value: 'Osasco' },
    { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
    { label: 'São Bento', value: 'São Bento' },
    { label: 'São Francisco', value: 'São Francisco' },
    { label: 'São Paulo', value: 'São Paulo' }    
  ];

  public readonly genreOptions: Array<ThfRadioGroupOption> = [
    { label: 'Feminino', value: 'Female' },
    { label: 'Masculino', value: 'Male' },
    { label: 'Outros', value: 'Other' }    
  ]

  public readonly statusOptions: Array<ThfCheckboxGroupOption> = [
    { label: 'Ativo', value: 'Active' },
    { label: 'Inativo', value: 'Inactive' }    
  ]

  /** bind do componente modal para pesquisa avançada */
  @ViewChild('advancedFilter') advancedFilter: ThfModalComponent;

  /** Objeto que define a confirmação da pesquisa avançada */
  public readonly advancedFilterPrimaryAction: ThfModalAction = {
    action: this.onConfirmAdvancedFilter.bind(this),
    label: 'Pesquisar',
  }

  /** Objeto para demonstrar quais os filtros aplicados na página */
  public readonly disclaimerGroup: ThfDisclaimerGroup = {
    change: this.onChangeDisclaimerGroup.bind(this),
    title: 'Filtros',
    disclaimers: [],
  }

  /** @description Cancelamento da pesquisa avançada */
  public readonly advancedFilterSecondaryAction: ThfModalAction = {
    action: () => this.advancedFilter.close(),
    label: 'Cancelar',
  }

  /** @description Construtor da classe */
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }
  
  ngOnDestroy() {
    this.clienteSub.unsubscribe();
  }
  
  /** @description Carregar mais dados, controlando resultados da busca e paginação */
  showMore() {
    let params: any = {
      page: ++this.page
    }

    if (this.searchTerm) {
      params.search = this.searchTerm
    } else {
      params = { ...params, ...this.searchFilters }
    }    
    this.loadData(params);
  }

  /** @description Ação do botão busca avançada */
  openAdvancedFilter() {
    this.advancedFilter.open();
  }

  /** @description Link de envio de e-mail */
  private sendMail(email, cliente) {
    const body = `Olá ${cliente.name}, gostaríamos de agradecer seu contato.`;
    const subject = `Contato - Cliente ${cliente.name}`;

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }
  
  /** @description Ação da busca rápida */
  private onActionSearch() {
    this.searchFilters = {};
    this.page = 1;

    this.loadData({search: this.searchTerm})

    this.disclaimerGroup.disclaimers = [{
      label: `Pesquisa rápida: ${this.searchTerm}`,
      property: 'search',
      value: this.searchTerm
    }];    

  }

  /** Função de pesquisa avançada */
  private onConfirmAdvancedFilter() {
    this.searchFilters = {
      name: this.name || '',
      city: this.city || '',
      genre: this.genre || '',
      status: this.status ? this.status.join() : '' // Transforma o checkbox em String separada por ","
    }

    this.searchTerm = undefined; // Limpa o campo de pesquisa rápida
    this.page = 1; // Reseta a paginação

    this.loadData(this.searchFilters);

    this.advancedFilter.close(); // Fecha o modal de pesquisa avançada
  }

  /** @description Ação efetuada na atualização do disclaimerGroup */
  private onChangeDisclaimerGroup() {
    this.searchTerm = undefined;
    this.page = 1;
    this.loadData();
  }

  /** @description Consulta dos dados */
  public loadData(params: { page?: number, search?: string} = {}) {
    this.loading = true;
    console.log('buscando...')
    this.clienteSub = this.httpClient.get(this.url, { params: <any>params })
    .subscribe((response: {hasNext: boolean, items: Array<any>}) => {
      this.clientes = !params.page || params.page === 1 
      ? response.items
      : [...this.clientes, ...response.items];
      this.hasNext = response.hasNext;
      this.loading = false;
      console.log('retornou', response.items)
    });
  }

}
