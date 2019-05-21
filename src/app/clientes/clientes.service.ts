import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericService } from '../generic/service/generic.service';
import { Customer } from '../model/customer.interface';

@Injectable()
export class ClientesService extends GenericService<Customer> {

  path = 'people';

  constructor(http: HttpClient) {
    super(http);
  }
}
