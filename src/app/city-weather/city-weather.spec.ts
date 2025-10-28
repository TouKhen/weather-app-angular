import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityWeather } from './city-weather';

describe('CityWeather', () => {
  let component: CityWeather;
  let fixture: ComponentFixture<CityWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityWeather]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityWeather);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
