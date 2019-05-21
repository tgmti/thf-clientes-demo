import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { map, take } from 'rxjs/operators';
import { ThfNotificationService } from '@totvs/thf-ui';
import { Customer } from 'src/app/model/customer.interface';
import { ClientesService } from '../clientes.service';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.component.html',
  styleUrls: ['./cliente-view.component.css']
})
export class ClienteViewComponent implements OnInit, OnDestroy {

  cliente: Customer = {};

  constructor(
    private clientesService: ClientesService, 
    private route: ActivatedRoute, 
    private router: Router,
    private thfNotification: ThfNotificationService) { }

  ngOnInit() {
    this.route.params
    .pipe(take(1))
    .subscribe(params => this.loadData(params['id']));
  }

  ngOnDestroy() {
    
  }

  /** Método do botão Editar */
  edit() {
    this.router.navigateByUrl(`clientes/edit/${this.cliente.id}`);
  }

  /** Método do botão Remover */
  remove() {
    this.clientesService.delete(this.cliente.id)
      .pipe(take(1))
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
    this.clientesService.getById(id)
    .pipe(
      map((cli: Customer) => {
        const status = { Active: 'Ativo', Inactive: 'Inativo' };

        const genre = { Female: 'Feminino', Male: 'Masculino', Other: 'Outros' };

        cli.status = status[cli.status];
        cli.genre = genre[cli.genre];

        return cli;
      }),
      take(1)
    )
    .subscribe(response => this.cliente = response);
  }

}
