import {Component, effect} from '@angular/core';
import {UnitsSignalsService} from './units.service';
import {NgClass} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-units',
  imports: [
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './units.html',
  styleUrl: './units.scss'
})
export class Units {
  constructor(private unitsSignals: UnitsSignalsService) {
    // Check if all switch are on for Imperial or Celsius
    effect(() => {
      if (this.unitsSignals.tempsUnit() == 'fahrenheit' &&
        this.unitsSignals.speedUnit() == 'mph' &&
        this.unitsSignals.heightUnit() == 'in' ) {
        this.isUnitSwitched = true;
        this.unitSwitchText = "Switch to Metric";
      } else if (this.unitsSignals.tempsUnit() == 'celsius' &&
        this.unitsSignals.speedUnit() == 'km/h' &&
        this.unitsSignals.heightUnit() == 'mm' ) {
        this.isUnitSwitched = false;
        this.unitSwitchText = "Switch to Imperial";
      }
    })
  }

  isUnitsDropdownToggled = false;
  unitsDropdownStyle = "unit-dropdown hidden";

  toggleUnitsDropdown() {
    if (!this.isUnitsDropdownToggled) {
      this.isUnitsDropdownToggled = true;

      this.unitsDropdownStyle = "unit-dropdown";
    } else {
      this.isUnitsDropdownToggled = false;

      this.unitsDropdownStyle = "unit-dropdown hidden";
    }
  }

  // Default state is Metric
  isUnitSwitched = false;
  unitSwitchText = "Switch to Imperial";

  unitsSwitch () {
    if (!this.isUnitSwitched) {
      this.isUnitSwitched = true;
      this.unitSwitchText = "Switch to Metric";

      // Changes units type to all imperial
      this.unitsSignals.tempsUnit.set("fahrenheit");
      this.unitsSignals.speedUnit.set("mph");
      this.unitsSignals.heightUnit.set("in");
    } else {
      this.isUnitSwitched = false;
      this.unitSwitchText = "Switch to Imperial";

      // Changes units type to all metric
      this.unitsSignals.tempsUnit.set("celsius");
      this.unitsSignals.speedUnit.set("km/h");
      this.unitsSignals.heightUnit.set("mm");
    }
  }

  // Forms
  // Temps
  tempsForm = new FormGroup({
    temps: new FormControl('')
  })

  changeTemps(event:any) {
    if (event.target.value === 'celsius') {
      this.unitsSignals.tempsUnit.set("celsius");
    } else if (event.target.value === 'fahrenheit') {
      this.unitsSignals.tempsUnit.set("fahrenheit");
    }
  }

  // Wind
  windForm = new FormGroup({
    wind: new FormControl('')
  })

  changeWind(event:any) {
    if (event.target.value === 'mph') {
      this.unitsSignals.speedUnit.set("mph");
    } else if (event.target.value === 'km/h') {
      this.unitsSignals.speedUnit.set("km/h");
    }
  }

  // Precipitation
  precipitationForm = new FormGroup({
    wind: new FormControl('')
  })

  changePrecipitation(event:any) {
    if (event.target.value === 'in') {
      this.unitsSignals.heightUnit.set("in");
    } else if (event.target.value === 'mm') {
      this.unitsSignals.heightUnit.set("mm");
    }
  }
}
