import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import population from '../../assets/population.json';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

export class CitystatisticsComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<IAreaStatistics>([]);
  displayedColumns: string[] = [];
  public statisticsData: IAreaStatistics[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

    this.dataSource = new MatTableDataSource<IAreaStatistics>(this.statisticsData);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (event: EventTarget) => {
    const element = event as HTMLInputElement
    const value = element.value
    this.dataSource.filter = value.trim();
  }
}