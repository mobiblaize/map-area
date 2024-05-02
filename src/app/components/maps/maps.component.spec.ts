import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapsComponent } from './maps.component';

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit new coordinates on map click', () => {
    spyOn(component.newCoordinates, 'emit');

    const event: any = {
      latlng: { lat: 10, lng: 20 }
    };

    component.onMapClick(event);
    fixture.detectChanges();

    expect(component.newCoordinates.emit).toHaveBeenCalledWith({ latitude: 10, longitude: 20 });
  });
});
