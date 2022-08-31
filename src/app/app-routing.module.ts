import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { AfisareProduseComponent } from './afisare-produse/afisare-produse.component';
import { ShoppingCart } from './shopping-cart';


const routes: Routes = [
  { path: '', redirectTo: 'AppComponent', pathMatch: 'full' },
  { path: 'produse', component: AfisareProduseComponent },
  { path: 'cart', component: ShoppingCart }
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // { enableTracing: true }
       // <-- debugging purposes only
    )
    // other imports here
  ],

})
export class AppRoutingModule { }
