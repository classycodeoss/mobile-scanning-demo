import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate) {
    swUpdate.available.subscribe(event => {
      if (window.confirm(`A new update is available. Would you like to load the latest version?`)) {
        swUpdate.activateUpdate().then(() => document.location.reload());
      }
    });
  }

  checkForUpdates() {
    this.swUpdate.checkForUpdate();
  }
}
