import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import population from '../../assets/population.json';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {IPlaseInfo} from './iplaceinfo';

@Component({
  selector: 'app-citystatistics',
  templateUrl: './citystatistics.component.html',
  styleUrls: ['./citystatistics.component.css'],
})
export class CitystatisticsComponent implements OnInit, AfterViewInit {
  dataSource!: MatTableDataSource<IPlaseInfo>;
  displayedColumns: string[] = [];
  statisticsData: IPlaseInfo[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.displayedColumns = ['name', 'population', 'area', 'density'];

    population.forEach((p) => {
      const element: IPlaseInfo = {
        number: p.Number,
        name: p.Name,
        population: p.Population,
        area: p.Area,
        density: p.Density,
      };
      this.statisticsData.push(element);
    });
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<IPlaseInfo>(this.statisticsData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (event: EventTarget) => {
    const element = event as HTMLInputElement;
    const value = element.value;
    this.dataSource.filter = value.trim();
  };
}
