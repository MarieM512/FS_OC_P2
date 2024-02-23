import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData = {
    labels: ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'],
    datasets: [{
      data: [120, 150, 180, 90],
      backgroundColor: ['red', 'orange', 'yellow', 'green'],
      hoverBackgroundColor: ['darkred', 'darkorange', 'darkyellow', 'darkgreen']
    }]
  };
}
