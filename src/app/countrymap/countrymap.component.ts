import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../environments/environment';
import additionalCosts from '../../assets/additionalcosts.json';
import {Observable, map} from 'rxjs';
import {FederalStateSelectionService} from '../services/stateselection/federalstateselection.service';

@Component({
  selector: 'app-countrymap',
  templateUrl: './countrymap.component.html',
  styleUrls: ['./countrymap.component.css'],
})
export class CountrymapComponent implements OnInit, AfterViewInit {
  style = 'mapbox://styles/mapbox/light-v11';
  lat = 51;
  lng = 10;
  mapObject!: mapboxgl.Map;
  hoveredStateId = 0;

  selectedFederalState$: Observable<string> = new Observable<string>();

  public landAcquisition = '';
  federalState = '';
  notary = '';
  realtor = '';

  constructor(private stateSelectionService: FederalStateSelectionService) {}

  ngOnInit(): void {
    this.selectedFederalState$ = this.stateSelectionService.selectedFederalState$.pipe(
      map((value) => {
        const additionalCost = additionalCosts.find(
          (aCost) => aCost.properties.federalState === value,
        );

        if (this.mapObject != null || this.mapObject != undefined) {
          if (this.hoveredStateId !== null) {
            this.mapObject.setFeatureState(
              {source: 'bundeslaender', id: this.hoveredStateId},
              {hover: false},
            );
          }

          if (additionalCost != undefined) {
            this.hoveredStateId = additionalCost?.id;
            this.mapObject.setFeatureState(
              {source: 'bundeslaender', id: this.hoveredStateId},
              {hover: true},
            );

            this.landAcquisition = additionalCost.properties.landAcquisition + '%';
            this.notary = 'rund ' + additionalCost.properties.notary + '%';
            this.realtor = additionalCost.properties.realtor + '%';
          } else {
            this.hoveredStateId = 0;
            this.federalState = '';
            this.landAcquisition = '';
            this.notary = '';
            this.realtor = '';
          }
        }
        return value;
      }),
    );
  }

  ngAfterViewInit() {
    this.mapObject = new mapboxgl.Map({
      container: 'mapElement',
      accessToken: environment.mapbox.accessToken,
      style: this.style,
      zoom: 5.4,
      center: [this.lng, this.lat],
    });

    this.mapObject.addControl(new mapboxgl.NavigationControl());

    this.mapObject.on('load', () => {
      this.mapObject.addSource('bundeslaender', {
        type: 'geojson',
        //data: '../assets/bundeslaender_simplify200.geojson',
        data: '../assets/federalstates.geojson',
        generateId: true,
      });

      // Add a new layer to visualize the states.
      this.mapObject.addLayer({
        'id': 'bundeslaender-layer',
        'type': 'fill',
        'source': 'bundeslaender',
        'layout': {},
        'paint': {
          'fill-color': '#e33c19',
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, 0.3],
        },
      });

      // Add a black outline around the states.
      this.mapObject.addLayer({
        'id': 'bundeslaender-border',
        'type': 'line',
        'source': 'bundeslaender',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 1.5,
        },
      });

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      this.mapObject.on('mousemove', 'bundeslaender-layer', (e: any) => {
        if (e.features.length > 0) {
          if (this.hoveredStateId !== null) {
            this.mapObject.setFeatureState(
              {source: 'bundeslaender', id: this.hoveredStateId},
              {hover: false},
            );
          }
          this.hoveredStateId = e.features[0].id;

          this.mapObject.setFeatureState(
            {source: 'bundeslaender', id: this.hoveredStateId},
            {hover: true},
          );
          const properties = additionalCosts[this.hoveredStateId].properties;
          this.federalState = e.features[0].properties.name;
          this.landAcquisition = properties.landAcquisition + '%';
          this.notary = 'rund ' + properties.notary + '%';
          this.realtor = properties.realtor + '%';

          this.stateSelectionService.updateSelectedFederalState(properties.federalState);
        }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      this.mapObject.on('mouseleave', 'bundeslaender-layer', () => {
        if (this.hoveredStateId !== null) {
          this.mapObject.setFeatureState(
            {source: 'bundeslaender', id: this.hoveredStateId},
            {hover: false},
          );
        }
        this.hoveredStateId = 0;

        this.federalState = '';
        this.landAcquisition = '';
        this.notary = '';
        this.realtor = '';

        this.stateSelectionService.updateSelectedFederalState('');
      });

      this.mapObject.on('idle', () => {
        this.mapObject.resize();
      });
    });
  }
}
