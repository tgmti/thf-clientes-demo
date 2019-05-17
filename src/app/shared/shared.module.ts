import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ThfModule } from '@totvs/thf-ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, /* Usado na busca avançada */
    ThfModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ThfModule
  ]
})
export class SharedModule { }
