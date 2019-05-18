import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.component.html',
  styleUrls: ['./cliente-view.component.css']
})
export class ClienteViewComponent implements OnInit, OnDestroy {

  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';

  private customerSub: Subscription;
  private paramsSub: Subscription;

  cliente: any = {};

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => this.loadData(params['id']));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.customerSub.unsubscribe();
  }

  /** Função que carrega os dados do cliente */
  private loadData(id) {
    this.customerSub = this.httpClient.get(`${this.url}/${id}`).subscribe(response => this.cliente = response);
  }

}
