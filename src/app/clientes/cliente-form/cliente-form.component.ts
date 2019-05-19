import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThfNotificationService, ThfSelectOption } from '@totvs/thf-ui';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

const actionInsert = 'insert';
const actionUpdate = 'update';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  private action: string = actionInsert;
  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';
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
    private httpClient: HttpClient,
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
      ? this.httpClient.put(`${this.url}/${cliente.id}`, cliente)
        .subscribe(() => this.navigateToList('Cliente atualizado com sucesso'))
      : this.httpClient.post(this.url, cliente)
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
    this.clienteSub = this.httpClient.get(`${this.url}/${id}`)
      .subscribe(response => this.cliente = response);
  }

  private navigateToList(msg?: string) {
    if (msg)
      this.thfNotification.success(msg);

    this.router.navigateByUrl('/clientes');
  }
 

}
