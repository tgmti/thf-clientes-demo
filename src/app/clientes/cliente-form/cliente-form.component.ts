import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThfNotificationService, ThfSelectOption } from '@totvs/thf-ui';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';
  private readonly clienteSub: Subscription;

  public cliente: any = {};

  public readonly genreOptions: Array<ThfSelectOption> = [
    { label: 'Feminino', value: 'Female' },
    { label: 'Masculino', value: 'Male' },
    { label: 'Outros', value: 'Other' }
  ];

  constructor(
    private thfNotification: ThfNotificationService,
    private router: Router,
    private httpClient: HttpClient) {

    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.clienteSub.unsubscribe();
  }

  save(){
    const cliente = {...this.cliente};
    cliente.status = cliente.status ? 'Active' : 'Inactive';

    this.clienteSub = this.httpClient.post(this.url, cliente).subscribe(() => {
      this.thfNotification.success('Cliente cadastrado com sucesso');
      this.router.navigateByUrl('/clientes');
    });
  }

}
