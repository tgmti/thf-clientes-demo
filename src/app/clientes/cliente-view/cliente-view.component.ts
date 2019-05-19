import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { map } from 'rxjs/operators';
import { ThfNotificationService } from '@totvs/thf-ui';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.component.html',
  styleUrls: ['./cliente-view.component.css']
})
export class ClienteViewComponent implements OnInit, OnDestroy {

  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';

  private customerSub: Subscription;
  private paramsSub: Subscription;
  private customerRemoveSub: Subscription;

  cliente: any = {};

  constructor(
    private httpClient: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router,
    private thfNotification: ThfNotificationService) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => this.loadData(params['id']));
  }

  ngOnDestroy() {
    if (this.paramsSub)
      this.paramsSub.unsubscribe();
    
    if (this.customerSub)
      this.customerSub.unsubscribe();
    
    if (this.customerRemoveSub)
      this.customerRemoveSub.unsubscribe();
  }

  /** Método do botão Editar */
  edit() {
    this.router.navigateByUrl(`clientes/edit/${this.cliente.id}`);
  }

  /** Método do botão Remover */
  remove() {
    this.customerRemoveSub = this.httpClient.delete(`${this.url}/${this.cliente.id}`)
      .subscribe(() => {
        this.thfNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.back();
      });
  }

  /** Método do botão Cancelar/Voltar */
  back() {
    this.router.navigateByUrl('clientes');
  }

  /** Função que carrega os dados do cliente */
  private loadData(id) {
    this.customerSub = this.httpClient.get(`${this.url}/${id}`)
    .pipe(
      map((cli: any) => {
        const status = { Active: 'Ativo', Inactive: 'Inativo' };

        const genre = { Female: 'Feminino', Male: 'Masculino', Other: 'Outros' };

        cli.status = status[cli.status];
        cli.genre = genre[cli.genre];

        return cli;
      })
    )
    .subscribe(response => this.cliente = response);
  }

}
