import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { ThfNotificationService, ThfSelectOption } from '@totvs/thf-ui';
import { ClientesService } from '../clientes.service';

const actionInsert = 'insert';
const actionUpdate = 'update';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  private action: string = actionInsert;
  private clienteSub: Subscription;
  private paramsSub: Subscription;

  public cliente: any = {};

  public readonly genreOptions: Array<ThfSelectOption> = [
    { label: 'Feminino', value: 'Female' },
    { label: 'Masculino', value: 'Male' },
    { label: 'Outros', value: 'Other' }
  ];

  constructor(
    private thfNotification: ThfNotificationService,
    private router: Router,
    private clientesService: ClientesService,
    private route: ActivatedRoute) {

    }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadData(params['id']);
        this.action = actionUpdate;
      }
    });
  }

  ngOnDestroy() {
    if (this.clienteSub)
      this.clienteSub.unsubscribe();

    if (this.paramsSub)
      this.paramsSub.unsubscribe();
  }

  save(){
    const cliente = {...this.cliente};
    cliente.status = cliente.status ? 'Active' : 'Inactive';

    this.clienteSub = this.isUpdateOperation
      ? this.clientesService.put(cliente)
        .subscribe(() => this.navigateToList('Cliente atualizado com sucesso'))
      : this.clientesService.post(cliente)
        .subscribe(() => this.navigateToList('Cliente cadastrado com sucesso'));

  }
  
  cancel(){
    this.navigateToList();
  }

  get title() {
    return this.isUpdateOperation ? 'Atualizando dados do cliente' : 'Novo cliente';
  }

  get isUpdateOperation() {
    return this.action === actionUpdate;
  }

  private loadData(id) {
    this.clienteSub = this.clientesService.getById(id)
      .pipe(
        map((cli: any) => {
          cli.status = cli.status === 'Active';

          return cli;
        })
      )
      .subscribe(response => this.cliente = response);
  }

  private navigateToList(msg?: string) {
    if (msg)
      this.thfNotification.success(msg);

    this.router.navigateByUrl('/clientes');
  }
 

}
