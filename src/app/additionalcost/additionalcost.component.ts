import {Component, OnInit, ViewChild} from '@angular/core';
import {IExtraCost} from './iextracost';
import {IExtraCostDiagram} from './iextracostdiagram';
import additionalCosts from 'src/assets/additionalcosts.json';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-additionalcost',
  templateUrl: './additionalcost.component.html',
  styleUrls: ['./additionalcost.component.css'],
})
export class AdditionalCostComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  extraCost: IExtraCost[] = [];
  extraCostDiagram!: IExtraCostDiagram;

  ngOnInit(): void {
    this.extraCostDiagram = {
      categories: [],
      landAcquisition: [],
      notary: [],
      realtor: [],
      totalCostWithRealtor: [],
      totalCostWithoutRealtor: [],
    };

    this.getExtraExpenses();

    this.chartOptions = {
      series: [
        {
          name: 'Grunderwerbsteuer',
          data: this.extraCostDiagram.landAcquisition,
        },
        {
          name: 'Notar- und Grundbuchkosten',
          data: this.extraCostDiagram.notary,
        },
        {
          name: 'Maklergebühren (Anteil Käufer)*',
          data: this.extraCostDiagram.realtor,
        },
      ],
      chart: {
        type: 'bar',
        height: 400,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: 'Kreditnebenkosten',
        align: 'center',
      },
      xaxis: {
        categories: this.extraCostDiagram.categories,
        labels: {
          formatter: function (val: any) {
            return val + '%';
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + 'K';
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };
  }

  getExtraExpenses(): void {
    additionalCosts.forEach((element) => {
      const const2: IExtraCost = {
        id: element.properties.id,
        federalState: element.properties.federalState,
        landAcquisition: element.properties.landAcquisition,
        notary: element.properties.notary,
        realtor: element.properties.realtor,
        totalCostWithRealtor:
          element.properties.realtor +
          element.properties.notary +
          element.properties.landAcquisition,
        totalCostWithoutRealtor: element.properties.notary + element.properties.landAcquisition,
      };

      this.extraCost.push(const2);
    });

    this.extraCost
      .sort((n1, n2) => {
        if (n1.totalCostWithRealtor < n2.totalCostWithRealtor) {
          return -1;
        }
        if (n1.totalCostWithRealtor > n2.totalCostWithRealtor) {
          return 1;
        }
        return 0;
      })
      .reverse();

    this.extraCost.forEach((element) => {
      this.extraCostDiagram.categories.push(element.federalState);
      this.extraCostDiagram.landAcquisition.push(element.landAcquisition);
      this.extraCostDiagram.notary.push(element.notary);
      this.extraCostDiagram.realtor.push(element.realtor);
      this.extraCostDiagram.totalCostWithRealtor.push(element.totalCostWithRealtor);
      this.extraCostDiagram.totalCostWithoutRealtor.push(element.totalCostWithoutRealtor);
    });
  }
}
