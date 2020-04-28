import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeepService {

  constructor() {
  }

  beep() {
    const audio = new Audio();
    audio.src = 'assets/beep.wav';
    audio.load();
    audio.play();
  }
}
