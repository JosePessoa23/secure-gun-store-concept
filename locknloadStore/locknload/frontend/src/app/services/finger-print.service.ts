import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class FingerPrintService {

  constructor() {
    //
  }

  async getFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    return visitorId
  }
}
