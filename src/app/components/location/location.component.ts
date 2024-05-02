import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Coordinates } from '../../models/coordinates.model';
import { LatLngExpression } from 'leaflet';
import area from '@turf/area'; // Import area function from @turf/area
import { polygon } from '@turf/helpers';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription[] = [];
  coordinatesForm!: FormGroup;
  coordinates: Coordinates[] = [];
  currentLocation?: Coordinates;
  area?: number;
  formChanged = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
  }

  logout(): void {
    const logOutSb = this.authService.logout().subscribe();
    this.unsubscribe.push(logOutSb);
  }

  ngOnInit(): void {
    // Get user's current location and update the centroid
    navigator.geolocation.getCurrentPosition((position) => {
      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.initForm();
    }, (error) => {
      console.error('Error getting location:', error);
      this.currentLocation = {
        latitude: 42.3601,
        longitude: -71.0589
      };
      this.initForm();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  get centroid(): LatLngExpression {
    return [this.currentLocation?.latitude ?? 42.3601, this.currentLocation?.longitude ?? -71.0589];
  }

  initForm() {
    this.coordinatesForm = this.formBuilder.group({
      coordinates: this.formBuilder.array([], Validators.minLength(4))
    });

    // Create initial coordinate fields
    this.addCoordinateField(this.currentLocation);
    const fmSbcr = this.coordinatesForm.valueChanges.subscribe(()=> {
      this.formChanged = true;
    });
    this.unsubscribe.push(fmSbcr);
  }

  // Function to calculate area based on coordinates using @turf/area
  calculateArea(): void {
    if (this.coordinates.length >= 4) {
      const coords = this.coordinates.map(coord => [coord.longitude, coord.latitude]);
      console.log(coords);

      coords.push(coords[0]); // Add the first coordinate as the last coordinate to close the polygon
      const poly = polygon([coords]); // Construct a GeoJSON polygon
      console.log(poly);
      this.area = area(poly);
    } else {
      this.area = undefined; // Resets area if there are less than 3 coordinates
    }
  }

  get coordGroups() {
    return this.coordinatesForm.get('coordinates') as FormArray
  }

  updateCoordinatesForm(coordinates: Coordinates) {
    this.addCoordinateField(coordinates);
    this.coordinates = this.coordGroups.value;
    this.calculateArea();
  }

  addCoordinateField(coordinate?: Coordinates): void {
    const coordinatesArray = this.coordGroups;
    coordinatesArray.push(this.createCoordinateGroup(coordinate));
  }

  removeCoordinateField(index: number): void {
    const coordinatesArray = this.coordGroups;
    coordinatesArray.removeAt(index);
    this.submitCoordinate();
  }

  createCoordinateGroup(coordinate?: Coordinates): FormGroup {
    return this.formBuilder.group({
      latitude: [coordinate?.latitude ?? '', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [coordinate?.longitude ?? '', [Validators.required, Validators.min(-180), Validators.max(180)]]
    });
  }

  submitCoordinate(): void {
    // Handle adding coordinates
    this.coordinates = this.coordGroups.value;
    this.calculateArea();
    this.formChanged = false;
  }

  clearCoordinates(): void {
    this.coordGroups.clear();
    this.submitCoordinate();
  }
}
