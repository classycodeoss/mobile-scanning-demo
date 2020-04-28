import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BeepService } from './beep.service';
import Quagga from 'quagga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  errorMessage: string;
  scannedCode: string;
  scannedCodeDate: number;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private beepService: BeepService) {
  }

  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }

    Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          constraints: {
            facingMode: 'environment'
          },
          area: { // defines rectangle of the detection/localization area
            top: '40%',    // top offset
            right: '0%',  // right offset
            left: '0%',   // left offset
            bottom: '40%'  // bottom offset
          },
        },
        decoder: {
          readers: ['ean_reader']
        },
      },
      (err) => {
        if (err) {
          this.errorMessage = `QuaggaJS could not be initialized, err: ${err}`;
        } else {
          Quagga.start();
          Quagga.onDetected((res) => {
            this.onBarcodeScanned(res.codeResult.code);
          })
        }
      })
  }

  onBarcodeScanned(code: string) {

    // ignore duplicates for an interval of 2.5 seconds
    const now = new Date().getTime();
    if (code === this.scannedCode && (now < this.scannedCodeDate + 2500)) {
      return;
    }

    this.scannedCode = code;
    this.scannedCodeDate = new Date().getTime();
    this.beepService.beep();
    this.changeDetectorRef.detectChanges();
  }
}
