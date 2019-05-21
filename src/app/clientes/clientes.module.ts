import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClienteViewComponent } from './cliente-view/cliente-view.component';
import { ClientesService } from './clientes.service';

@NgModule({
  declarations: [ClienteListComponent, ClienteFormComponent, ClienteViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    ClientesRoutingModule
  ],
  providers: [
    ClientesService
  ]
})
export class ClientesModule { }
