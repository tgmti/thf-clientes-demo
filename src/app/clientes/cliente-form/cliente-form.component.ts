import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThfNotificationService } from '@totvs/thf-ui';
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
    this.clienteSub = this.httpClient.post(this.url, this.cliente).subscribe(() => {
      this.thfNotification.success('Cliente cadastrado com sucesso');
      this.router.navigateByUrl('/clientes');
    });
  }

}
