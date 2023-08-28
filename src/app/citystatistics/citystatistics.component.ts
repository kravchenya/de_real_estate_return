import { Component, OnInit } from '@angular/core';
import population from '../../assets/population.json';

export interface IAreaStatistics {
  number: number;
  name: string;
  population: number;
  area: number;
  density: number;
}


@Component({
  selector: 'app-citystatistics',
  templateUrl: './citystatistics.component.html',
  styleUrls: ['./citystatistics.component.css']
})

export class CitystatisticsComponent implements OnInit {

  displayedColumns: string[] = [];
  public statisticsData: IAreaStatistics[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.displayedColumns = ['name', 'population', 'area', 'density'];

    population.forEach((p) => {
      var element: IAreaStatistics = {
        number: p.Number,
        name: p.Name,
        population: p.Population,
        area: p.Area,
        density: p.Density,
      };
      this.statisticsData.push(element);
    });
  }
}
