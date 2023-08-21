import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import additionalCosts from 'src/assets/additionalcosts.json';

@Component({
  selector: 'app-countrymap',
  templateUrl: './countrymap.component.html',
  styleUrls: ['./countrymap.component.css']
})
export class CountrymapComponent implements OnInit {

  style = 'mapbox://styles/mapbox/light-v11';
  lat = 51;
  lng = 10;

  public landAcquisition2: string = '';
  federalState2: string = '';
  notary2: string = '';
  realtor2: string = '';

  constructor() { }

  ngOnInit(): void {
    var map = new mapboxgl.Map({
      container: 'mapElement',
      accessToken: environment.mapbox.accessToken,
      style: this.style,
      zoom: 5.4,
      center: [this.lng, this.lat]
    });

    map.addControl(new mapboxgl.NavigationControl());
    // map.addControl(new mapboxgl.FullscreenControl());

    var hoveredStateId = 0;

    // Target the span elements used in the sidebar
    var federalState = document.getElementById('federalState');
    var landAcquisition = document.getElementById('landAcquisition');
    var notary = document.getElementById('notary');
    var realtor = document.getElementById('realtor');

    map.on('load', () => {
      map.addSource('bundeslaender', {
        type: 'geojson',
        //data: '../assets/bundeslaender_simplify200.geojson',
        data: '../assets/federalstates.geojson',
        generateId: true
      });

      // Add a new layer to visualize the states.
      map.addLayer({
        'id': 'bundeslaender-layer',
        'type': 'fill',
        'source': 'bundeslaender',
        'layout': {},
        'paint': {
          'fill-color': '#e33c19',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.6,
            0.3
          ]
        }
      });

      // Add a black outline around the states.
      map.addLayer({
        'id': 'bundeslaender-border',
        'type': 'line',
        'source': 'bundeslaender',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 1.5
        }
      });

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      map.on('mousemove', 'bundeslaender-layer', (e: any) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: 'bundeslaender', id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;

          map.setFeatureState(
            { source: 'bundeslaender', id: hoveredStateId },
            { hover: true }
          );

          // federalState!.textContent = e.features[0].properties.name;
          this.federalState2 = e.features[0].properties.name;
          this.landAcquisition2 = additionalCosts[hoveredStateId].properties.landAcquisition + '%';
          //landAcquisition!.textContent = additionalCosts[hoveredStateId].properties.landAcquisition  + '%';
          // notary!.textContent = 'rund ' + additionalCosts[hoveredStateId].properties.notary  + '%';
          this.notary2! = 'rund ' + additionalCosts[hoveredStateId].properties.notary + '%';
          // realtor!.textContent =  additionalCosts[hoveredStateId].properties.realtor  + '%';
          this.realtor2! = additionalCosts[hoveredStateId].properties.realtor + '%';

        }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'bundeslaender-layer', () => {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: 'bundeslaender', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = 0;

        // federalState!.textContent = '';
        // landAcquisition!.textContent = '';
        // notary!.textContent = '';
        // realtor!.textContent = '';

        this.federalState2 = '';
        this.landAcquisition2 = '';
        this.notary2 = '';
        this.realtor2 = '';
      });

      map.on('idle', () => {
        map.resize()
      });

    });
  }
}
