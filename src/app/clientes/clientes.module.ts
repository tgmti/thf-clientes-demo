import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClienteListComponent } from './cliente-list/cliente-list.component';

@NgModule({
  declarations: [ClienteListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ClientesRoutingModule
  ]
})
export class ClientesModule { }
