import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  private readonly url: string = 'https://sample-customers-api.herokuapp.com/api/thf-samples/v1/people';

  public cliente: any = {};


  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  save(){
    this.httpClient.post(this.url, this.cliente);
  }

}
