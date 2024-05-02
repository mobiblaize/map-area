import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Coordinates } from '../../models/coordinates.model';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, OnChanges {
  @Input() coordinates: Coordinates[] = [];
  private map!: L.Map;
  @Input() centroid: L.LatLngExpression = [0, 0];
  @Output() newCoordinates = new EventEmitter<Coordinates>();
  private iconUrl = '/assets/images/marker-icon.png'; // URL to your custom marker icon
  private shadowUrl = '/assets/images/marker-shadow.png'; // URL to your custom marker shadow
  markers: L.Marker[] = []; // Array to store markers

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Create a custom marker icon
    const customIcon = L.icon({
      iconUrl: this.iconUrl,
      shadowUrl: this.shadowUrl,
      iconSize: [25, 41], // size of the icon
      iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
    });


    // Create marker for current location and add it to the map
    const marker = L.marker(this.centroid, { icon: customIcon }).addTo(this.map);
    marker.bindPopup('Your Location').openPopup();
    this.markers.push(marker); // Add marker to array
    // Set the map center to the current location
    this.map.setView(this.centroid, 12);

    tiles.addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.onMapClick(event);
    });
  }

  private updateMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add markers for each coordinate
    this.coordinates.forEach(coord => {
      const latlng: L.LatLng = L.latLng(coord.latitude, coord.longitude);
      const marker = L.marker(latlng, {
        icon: L.icon({
          iconUrl: this.iconUrl,
          shadowUrl: this.shadowUrl,
          iconSize: [25, 41], // size of the icon
          iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
          popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
        })
      }).addTo(this.map);
      this.markers.push(marker);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coordinates'] && !changes['coordinates'].firstChange) {
      this.updateMarkers();
    }
  }

  onMapClick(event: L.LeafletMouseEvent): void {
    const latlng: L.LatLng = event.latlng;
    const marker = L.marker(latlng, {
      icon: L.icon({
        iconUrl: this.iconUrl,
        shadowUrl: this.shadowUrl,
        iconSize: [25, 41], // size of the icon
        iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
      })
    }).addTo(this.map);
    this.markers.push(marker); // Add marker to array
    this.newCoordinates.emit({
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    });
  }
  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }
}
