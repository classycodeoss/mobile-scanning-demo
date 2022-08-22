import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';

import { environment } from '../environments/environment';

import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule} from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AfisareProduseComponent } from './afisare-produse/afisare-produse.component';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    AppComponent,
    ShoppingCartItemComponent,
    AfisareProduseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,


    // provideFirebaseApp(() => initializeApp({ ... })),
    // provideFirestore(() => getFirestore()),

    AngularFireModule.initializeApp(environment.firebase),




    // PWA support
    ServiceWorkerModule.register('ngsw-worker.js'),
            AppRoutingModule
  ],
  providers: [
    {
      provide: SwRegistrationOptions,
      useFactory: () => {
        return {
          enabled: environment.production,
          registrationStrategy: 'registerImmediately'
        };
      }
    },



  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
