import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AfisareProduseComponent } from './afisare-produse/afisare-produse.component';
import { RouterModule } from '@angular/router';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';

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
    MatTabsModule,






    // PWA support
    ServiceWorkerModule.register('ngsw-worker.js'),
            AppRoutingModule,
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideAuth(() => getAuth()),
            provideDatabase(() => getDatabase()),
            provideFirestore(() => getFirestore()),
            provideFunctions(() => getFunctions()),
            BrowserAnimationsModule
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
