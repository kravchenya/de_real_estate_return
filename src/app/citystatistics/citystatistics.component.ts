import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import population from '../../assets/population.json';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {IPlaseInfo} from './iplaceinfo';
import {FederalStateSelectionService} from '../services/stateselection/federalstateselection.service';

@Component({
  selector: 'app-citystatistics',
  templateUrl: './citystatistics.component.html',
  styleUrls: ['./citystatistics.component.css'],
})
export class CityStatisticsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<IPlaseInfo> = new MatTableDataSource<IPlaseInfo>();
  displayedColumns: string[] = [];
  statisticsData: IPlaseInfo[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  clickedRows = new Set<IPlaseInfo>();

  constructor(private stateSelectionService: FederalStateSelectionService) {}

  ngOnInit(): void {
    this.displayedColumns = ['name', 'population', 'area', 'density'];

    population.forEach((p) => {
      const element: IPlaseInfo = {
        index: p.Number,
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

  public rowClick(selectedRow: IPlaseInfo) {
    const federalState = population.find((data) => data.Number === selectedRow.index)?.FederalState;

    if (this.clickedRows.has(selectedRow)) {
      this.clickedRows.clear();
      this.stateSelectionService.updateSelectedFederalState('');
    } else {
      this.clickedRows.clear();
      this.clickedRows.add(selectedRow);

      if (federalState !== undefined) {
        this.stateSelectionService.updateSelectedFederalState(federalState);
      }
    }
  }
}
