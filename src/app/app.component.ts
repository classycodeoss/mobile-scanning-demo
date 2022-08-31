import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { BeepService } from './beep.service';
import Quagga from '@ericblade/quagga2';
import { Article } from './article';
import { ShoppingCart } from './shopping-cart';
import { UpdateService } from './update.service';
import { environment } from '../environments/environment';
import { getMainBarcodeScanningCamera } from './camera-access';

import { Observable } from 'rxjs';
import { PokedexFirestoreService } from './pokedex-firestore.service';
import { DocumentData } from '@angular/fire/firestore';
import { enableDebugTools } from '@angular/platform-browser';
import {MatTabsModule} from '@angular/material/tabs';
// import { MatIconModule } from '@angular/material/icon'
import {MatTableDataSource, MatTableModule} from '@angular/material/table'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  started: boolean | undefined;
  errorMessage: string | undefined;
  acceptAnyCode = true;
  items: [Article, number][] = [];
  totalPrice: number = 0;

  private catalogue: Article[] = [
    { name: 'Classy Crab (red)', ean: '7601234567890', image: 'assets/classy_crab_red.png', price: 10 },
    { name: 'Classy Crab (blue)', ean: '7601234561232', image: 'assets/classy_crab_blue.png', price: 10 },
    { name: 'Classy Crab (gold, ltd. ed.)', ean: '7601234564561', image: 'assets/classy_crab_gold.png', price: 50 },
    { name: 'Cafea', ean: '8000070038028', image: 'https://www.lavazza.ro/ro/cafea/macinata/qualita-rossa.html', price: 50 }
  ];
  public catalogue2: Article[] = [];




  displayedColumns: string[] = ['name', 'ean', 'price'];
  dataSource: any;


  pokemon$: Observable<DocumentData>;

  private shoppingCart: ShoppingCart;
  private lastScannedCode: string | undefined;
  private lastScannedCodeDate: number  | undefined;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private beepService: BeepService,
              private updateService: UpdateService,
              private pokedexService: PokedexFirestoreService

              // public firestore: Firestore
            ) {
    this.shoppingCart = new ShoppingCart();

    // const collection = collection(firestore, 'fsda');
    // this.item$ = collectionData(collection);

  }

  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }

    this.initializeScanner();

    if (environment.production) {
      setTimeout(() => {
        this.updateService.checkForUpdates();
      }, 10000);
    }
    this.logheaza();
    this.getDocs();
    this.getDocsForTable();
    this.pokemon$ = this.pokedexService.getAll();
  }


  public getDocs() {
    this.beepService
      .getDocs()
      .subscribe((data) => {
        this.catalogue2 = data;
        console.log('mongo Crabs=>', this.catalogue2);
      });
  }
  public getDocsForTable() {
    this.beepService
      .getDocs()
      .subscribe((data) => {
        this.dataSource = data;
        console.log('table docs=>', this.dataSource);
      });
  }

  logheaza(){
    console.log("WORKS")
    console.log(this.pokemon$)
  }

  private initializeScanner(): Promise<void> {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported. Please use Chrome on Android or Safari on iOS';
      this.started = false;
      return Promise.reject(this.errorMessage);
    }

    // enumerate devices and do some heuristics to find a suitable first camera
    return Quagga.CameraAccess.enumerateVideoDevices()
      .then(mediaDeviceInfos => {
        const mainCamera = getMainBarcodeScanningCamera(mediaDeviceInfos);
        if (mainCamera) {
          console.log(`Using ${mainCamera.label} (${mainCamera.deviceId}) as initial camera`);
          return this.initializeScannerWithDevice(mainCamera.deviceId);
        } else {
          console.error(`Unable to determine suitable camera, will fall back to default handling`);
          return this.initializeScannerWithDevice(undefined);
        }
      })
      .catch(error => {
        this.errorMessage = `Failed to enumerate devices: ${error}`;
        this.started = false;
      });
  }

  private initializeScannerWithDevice(preferredDeviceId: string | undefined): Promise<void> {
    console.log(`Initializing Quagga scanner...`);

    const constraints: MediaTrackConstraints = {};
    if (preferredDeviceId) {
      // if we have a specific device, we select that
      constraints.deviceId = preferredDeviceId;
    } else {
      // otherwise we tell the browser we want a camera facing backwards (note that browser does not always care about this)
      constraints.facingMode = 'environment';
    }

    return Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints,
          area: { // defines rectangle of the detection/localization area
            top: '25%',    // top offset
            right: '10%',  // right offset
            left: '10%',   // left offset
            bottom: '25%'  // bottom offset
          },
          target: document.querySelector('#scanner-container') ?? undefined
        },
        decoder: {
          readers: ['ean_reader'],
          multiple: false
        },
        // See: https://github.com/ericblade/quagga2/blob/master/README.md#locate
        locate: false
      },
      (err) => {
        if (err) {
          console.error(`Quagga initialization failed: ${err}`);
          this.errorMessage = `Initialization error: ${err}`;
          this.started = false;
        } else {
          console.log(`Quagga initialization succeeded`);
          Quagga.start();
          this.started = true;
          this.changeDetectorRef.detectChanges();
          Quagga.onDetected((res) => {
            if (res.codeResult.code) {
              this.onBarcodeScanned(res.codeResult.code);
            }
          });
        }
      });
  }

  onBarcodeScanned(code: string) {

    // ignore duplicates for an interval of 1.5 seconds
    const now = new Date().getTime();
    if (code === this.lastScannedCode
      && ((this.lastScannedCodeDate !== undefined) && (now < this.lastScannedCodeDate + 3500))) {
      return;
    }

    // only accept articles from catalogue
    let article = this.catalogue.find((item) => item.ean === code);
    // alert(code)
    if (!article) {
      if (this.acceptAnyCode) {
        article = this.createUnknownArticle(code);
      } else {
        return;
      }
    }
    this.shoppingCart.addArticle(article);
    this.items = this.shoppingCart.contents;
    this.totalPrice = this.shoppingCart.totalPrice;

    this.lastScannedCode = code;
    this.lastScannedCodeDate = now;
    this.beepService.beep();
    this.changeDetectorRef.detectChanges();
  }

  clearCart() {
    this.shoppingCart.clear();
    this.items = this.shoppingCart.contents;
  }

  private createUnknownArticle(code: string): Article {

    function eanCheckDigit(code:any){
      let result = 0;
      let i = 1;
      for (let counter = code.length-2; counter >=0; counter--){
          result = result + parseInt(code.charAt(counter)) * (1+(2*(i % 2)));
          i++;
      }

      return (10 - (result % 10)) % 10;
  }



    if(eanCheckDigit(code) == 8){

      alert( eanCheckDigit(code) )
    }else {
      alert(eanCheckDigit(code))
    }

    return {
      ean: code,
      name: `Codul: ${code}`,
      image: 'assets/classy_crab_unknown.png',
      price:0
    }
  }

}
