import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UnitsSignalsService {
  tempsUnit = signal('celsius');
  speedUnit = signal('km/h');
  heightUnit = signal('mm');
}
