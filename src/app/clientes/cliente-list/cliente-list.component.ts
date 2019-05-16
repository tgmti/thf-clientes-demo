import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  // Url do servidor de exemplo
  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';
  private clienteSub = Subscription;

  public clientes: Array<any> = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.clienteSub = this.httpClient.get(this.url)
      .subscribe((response: {hasNext: boolean, items: Array<any>}) => {
        this.clientes = response.items
      });
  }

  ngOnDestroy() {
    this.clienteSub.unsubscribe();
  }

}
