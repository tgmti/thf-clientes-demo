import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { ThfTableColumn, ThfPageFilter, ThfModalComponent, ThfComboOption, ThfRadioGroupOption, ThfCheckboxGroupOption, ThfModalAction, ThfDisclaimerGroup, ThfDisclaimer, ThfPageAction, ThfTableAction } from '@totvs/thf-ui';
import { Router } from '@angular/router';

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

  /** @description Ações da tela de listagem */
  public readonly actions: Array<ThfPageAction> = [
    { action: this.onNewCustomer.bind(this), label: 'Cadastrar', icon: 'thf-icon-user-add' }
  ];

  /** @description Ações para a tabela de listagem */
  public readonly tableActions: Array<ThfTableAction> = [
    { action: this.onViewCustomer.bind(this), label: 'Visualizar' },
    { 
      action: this.onEditCustomer.bind(this), 
      disabled: this.canEditCustomer.bind(this), 
      label: 'Editar' 
    },
  ];

  /** @description Construtor da classe */
  constructor(private httpClient: HttpClient, private router: Router) { }

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
  private onNewCustomer() {
    this.router.navigateByUrl('/clientes/new');
  }
  
  /** @description Ação do link de visualização */
  private onViewCustomer(cliente: any) {
    this.router.navigateByUrl(`/clientes/view/${cliente.id}`);
  }
  
  /** @description Verifica se pode editar o cliente (somente ativos) */
  private canEditCustomer(customer) {
    return customer.status !== 'Active';
  }

  /** @description Ação do link de edição */
  private onEditCustomer(customer) {
    this.router.navigateByUrl(`/clientes/edit/${customer.id}`);
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
    this.disclaimerGroup.disclaimers = [{
      label: `Pesquisa rápida: ${this.searchTerm}`,
      property: 'search',
      value: this.searchTerm
    }];    

  }

  /** Função de pesquisa avançada */
  private onConfirmAdvancedFilter() {

    const addDisclaimer = (property: string, value: string, label: string) => 
      this.disclaimerGroup.disclaimers.push({property, value, label: `${label}: ${value}`});

    this.disclaimerGroup.disclaimers = [];

    addDisclaimer('city', this.city, 'Cidade')
    addDisclaimer('genre', this.genre, 'Gênero')
    addDisclaimer('name', this.name, 'Nome')
    addDisclaimer('status', this.status ? this.status.join() : '', 'Status')

    this.advancedFilter.close(); // Fecha o modal de pesquisa avançada
  }

  /** @description Ação efetuada na atualização do disclaimerGroup */
  private onChangeDisclaimerGroup(disclaimers: Array<ThfDisclaimer>) {
    this.searchFilters = {};
    this.page = 1;

    disclaimers.forEach(disclaimer => this.searchFilters[disclaimer.property] = disclaimer.value);

    if (!this.searchFilters.search) {
      this.searchTerm = undefined;
    }

    this.loadData(this.searchFilters);
  }

  /** @description Consulta dos dados */
  public loadData(params: { page?: number, search?: string} = {}) {
    this.loading = true;
    this.clienteSub = this.httpClient.get(this.url, { params: <any>params })
    .subscribe((response: {hasNext: boolean, items: Array<any>}) => {
      this.clientes = !params.page || params.page === 1 
      ? response.items
      : [...this.clientes, ...response.items];
      this.hasNext = response.hasNext;
      this.loading = false;
    });
  }

}
