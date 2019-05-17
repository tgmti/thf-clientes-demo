import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { ThfTableColumn, ThfPageFilter } from '@totvs/thf-ui';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  // Url do servidor de exemplo
  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';
  private clienteSub = Subscription;
  private page: number = 1;

  public clientes: Array<any> = [];
  public loading: boolean = true;
  public hasNext: boolean = false;

  public searchTerm: string = '';

  public readonly filter: ThfPageFilter = {
    action: this.onActionSearch.bind(this),
    ngModel: 'searchTerm',
    placeholder: 'Pesquisar por ...'
  }

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

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }
  
  ngOnDestroy() {
    this.clienteSub.unsubscribe();
  }
  
  showMore() {
    this.loadData({ page: ++this.page, search: this.searchTerm });
  }

  private sendMail(email, cliente) {
    const body = `Olá ${cliente.name}, gostaríamos de agradecer seu contato.`;
    const subject = `Contato - Cliente ${cliente.name}`;

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }
  
  private onActionSearch() {
    this.page = 1;
    this.loadData({search: this.searchTerm})
  }

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
