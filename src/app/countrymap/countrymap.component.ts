import {AfterViewInit, Component} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from 'src/environments/environment';
import additionalCosts from 'src/assets/additionalcosts.json';

@Component({
  selector: 'app-countrymap',
  templateUrl: './countrymap.component.html',
  styleUrls: ['./countrymap.component.css'],
})
export class CountrymapComponent implements AfterViewInit {
  style = 'mapbox://styles/mapbox/light-v11';
  lat = 51;
  lng = 10;

  public landAcquisition = '';
  federalState = '';
  notary = '';
  realtor = '';

  ngAfterViewInit() {
    const map = new mapboxgl.Map({
      container: 'mapElement',
      accessToken: environment.mapbox.accessToken,
      style: this.style,
      zoom: 5.4,
      center: [this.lng, this.lat],
    });

    map.addControl(new mapboxgl.NavigationControl());

    let hoveredStateId = 0;

    map.on('load', () => {
      map.addSource('bundeslaender', {
        type: 'geojson',
        //data: '../assets/bundeslaender_simplify200.geojson',
        data: '../assets/federalstates.geojson',
        generateId: true,
      });

      // Add a new layer to visualize the states.
      map.addLayer({
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
      map.addLayer({
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
      map.on('mousemove', 'bundeslaender-layer', (e: any) => {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState({source: 'bundeslaender', id: hoveredStateId}, {hover: false});
          }
          hoveredStateId = e.features[0].id;

          map.setFeatureState({source: 'bundeslaender', id: hoveredStateId}, {hover: true});

          // federalState!.textContent = e.features[0].properties.name;
          this.federalState = e.features[0].properties.name;
          this.landAcquisition = additionalCosts[hoveredStateId].properties.landAcquisition + '%';
          //landAcquisition!.textContent = additionalCosts[hoveredStateId].properties.landAcquisition  + '%';
          // notary!.textContent = 'rund ' + additionalCosts[hoveredStateId].properties.notary  + '%';
          this.notary! = 'rund ' + additionalCosts[hoveredStateId].properties.notary + '%';
          // realtor!.textContent =  additionalCosts[hoveredStateId].properties.realtor  + '%';
          this.realtor! = additionalCosts[hoveredStateId].properties.realtor + '%';
        }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'bundeslaender-layer', () => {
        if (hoveredStateId !== null) {
          map.setFeatureState({source: 'bundeslaender', id: hoveredStateId}, {hover: false});
        }
        hoveredStateId = 0;

        this.federalState = '';
        this.landAcquisition = '';
        this.notary = '';
        this.realtor = '';
      });

      map.on('idle', () => {
        map.resize();
      });
    });
  }
}
