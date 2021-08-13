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

  style = 'https://adv-smart.de/styles/public/de_style_colour_light.json';
  lat = 51;
  lng = 10;

  constructor() { }

  ngOnInit(): void {
    var map = new mapboxgl.Map({
      container: 'map',
      accessToken: environment.mapbox.accessToken,
      style: this.style,
      zoom: 5,
      center: [this.lng, this.lat]
    });

    // Add map controls
    map.addControl(new mapboxgl.NavigationControl());
    // map.addControl(new mapboxgl.FullscreenControl());

    var hoveredStateId = 0;

    // Target the span elements used in the sidebar
    var federalState = document.getElementById('federalState');
    var landAcquisition = document.getElementById('landAcquisition');
    var notary = document.getElementById('notary');
    var realtor = document.getElementById('realtor');

    map.on('load', function () {
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
      map.on('mousemove', 'bundeslaender-layer', function (e: any) {
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            map.setFeatureState(
              { source: 'bundeslaender', id: hoveredStateId},
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id;
          
          map.setFeatureState(
            { source: 'bundeslaender', id: hoveredStateId },
            { hover: true }
          );
                    
          federalState!.textContent = e.features[0].properties.name;
          landAcquisition!.textContent = additionalCosts[hoveredStateId].properties.landAcquisition  + '%';
          notary!.textContent = 'rund ' + additionalCosts[hoveredStateId].properties.notary  + '%';
          realtor!.textContent =  additionalCosts[hoveredStateId].properties.realtor  + '%';

        }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'bundeslaender-layer', function () {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: 'bundeslaender', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = 0;

        federalState!.textContent = '';
        landAcquisition!.textContent = '';
        notary!.textContent = '';
        realtor!.textContent = '';
      });

      map.on('idle',function(){
        map.resize()
      });

      // setTimeout(() => this.map.resize(), 0);

    });
  }

}
