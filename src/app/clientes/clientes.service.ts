import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericService } from '../generic/service/generic.service';
import { Customer } from '../model/customer.interface';
import { Subject } from 'rxjs';

@Injectable()
export class ClientesService extends GenericService<Customer> {

  private loading$ = new Subject<boolean>();
  private hasNext$ = new Subject<boolean>();
  private clientes: Array<Customer>
  path = 'people';

  constructor(http: HttpClient) {
    super(http);
  }

  setLoading(isLoading:boolean) {
    this.loading$.next(isLoading);
  }

  setHasNext(has:boolean) {
    this.hasNext$.next(has);
  }

  loading() {
    return this.loading$.asObservable();
  }
  
  hasNext() {
    return this.hasNext$.asObservable();
  }
}
