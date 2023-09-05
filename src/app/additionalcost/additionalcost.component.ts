import {Component, OnInit} from '@angular/core';
import {IExtraCost} from './iextracost';
import {IExtraCostDiagram} from './iextracostdiagram';
import additionalCosts from '../../assets/additionalcosts.json';

import {
  ApexAxisChartSeries,
  ApexChart,
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
import {TranslateService} from '@ngx-translate/core';
import ApexCharts from 'apexcharts';

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
  extraCost: IExtraCost[] = [];
  extraCostDiagram!: IExtraCostDiagram;

  constructor(private translate: TranslateService) {}

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

    const chartOptions = {
      series: [],
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
      xaxis: {
        categories: this.extraCostDiagram.categories,
        labels: {
          formatter: function (value: string) {
            return value + '%';
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
          formatter: function (val: number) {
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

    const apexChart = new ApexCharts(document.querySelector('#closingCostChart'), chartOptions);
    apexChart.render();

    this.translate.onLangChange.subscribe(() => {
      this.translate
        .get([
          'ADDITIONALCOST_CLOSING_COST',
          'ADDITIONALCOST_REAL_ESTATE_TRANSFER_TAX',
          'ADDITIONALCOST_LAND_REGISTRATION_TAX',
          'ADDITIONALCOST_REAL_ESTATE_AGENT_FEE',
        ])
        .subscribe((translatedTexts) => {
          apexChart.updateOptions({
            title: {
              text: translatedTexts.ADDITIONALCOST_CLOSING_COST,
              align: 'center',
            },
            series: [
              {
                name: translatedTexts.ADDITIONALCOST_REAL_ESTATE_TRANSFER_TAX,
                data: this.extraCostDiagram.landAcquisition,
              },
              {
                name: translatedTexts.ADDITIONALCOST_LAND_REGISTRATION_TAX,
                data: this.extraCostDiagram.notary,
              },
              {
                name: translatedTexts.ADDITIONALCOST_REAL_ESTATE_AGENT_FEE,
                data: this.extraCostDiagram.realtor,
              },
            ],
          });
        });
    });

    this.translate
      .get([
        'ADDITIONALCOST_CLOSING_COST',
        'ADDITIONALCOST_REAL_ESTATE_TRANSFER_TAX',
        'ADDITIONALCOST_LAND_REGISTRATION_TAX',
        'ADDITIONALCOST_REAL_ESTATE_AGENT_FEE',
      ])
      .subscribe((translatedTexts) => {
        apexChart.updateOptions({
          title: {
            text: translatedTexts.ADDITIONALCOST_CLOSING_COST,
            align: 'center',
          },
          series: [
            {
              name: translatedTexts.ADDITIONALCOST_REAL_ESTATE_TRANSFER_TAX,
              data: this.extraCostDiagram.landAcquisition,
            },
            {
              name: translatedTexts.ADDITIONALCOST_LAND_REGISTRATION_TAX,
              data: this.extraCostDiagram.notary,
            },
            {
              name: translatedTexts.ADDITIONALCOST_REAL_ESTATE_AGENT_FEE,
              data: this.extraCostDiagram.realtor,
            },
          ],
        });
      });
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
