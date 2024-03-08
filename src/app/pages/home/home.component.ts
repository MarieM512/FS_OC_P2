import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Observable, map, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>
  countries$!: Observable<string[]>
  joNumber$!: Observable<number[]>
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { 
      position: "left"
    }}
  };
  pieChartType: ChartType = 'pie';
  pieChartData = {
    labels: ["One", "Two", "Three", "Four", "Five"],
    datasets: [{
      data: [1, 2, 3, 4, 5]
    }]
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      map(data => data.map(item => new Olympic(item.id, item.country, item.participations)))
    )
    this.joNumber$ = this.olympicService.getNumberOfJO()
    this.pieChartData.datasets.forEach(value => {
      value.data = this.olympicService.getPieChartData()
    })
    this.pieChartData.labels = this.olympicService.getCountriesList()
    this.olympics$.subscribe(item => {
      this.countries$ = of(this.olympicService.getCountriesList())
    })
  }

  public chartClicked(e: any) {
    const index = e.active[0].index + 1
    this.router.navigateByUrl("country/" + index)
  }
}
