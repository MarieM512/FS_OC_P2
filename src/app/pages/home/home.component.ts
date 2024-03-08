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
  public olympics$: Observable<Olympic[]> = of([])
  public countries$!: Observable<string[]>
  public medalsNumber: number[] = []
  joNumber$!: Observable<number[]>

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { 
      position: "left"
    }}
  };
  public pieChartType: ChartType = 'pie';

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      map(data => data.map(item => new Olympic(item.id, item.country, item.participations)))
    )

    this.joNumber$ = this.olympicService.getNumberOfJO()
    this.olympics$.subscribe(item => {

      // Countries
      let countries: string[] = []
      item.forEach(value => {
        countries.push(value.country)
      })
      this.countries$ = of(countries)
      this.pieChartData.labels = countries

      // Medals
      item.forEach(value => {
        let medals = 0
        value.participations.forEach(participation => {
          medals += participation.medalsCount
        })
        this.medalsNumber.push(medals)
      })
      this.pieChartData.datasets.forEach(value => {
        value.data = this.medalsNumber
      })

      // JO
      // let joNumber: number[] = []
      // item.forEach(value => {
      //   value.participations.forEach(value => {
      //     if (!joNumber.includes(value.year)) {
      //       joNumber.push(value.year)
      //     }
      //   })
      // })
      // this.joNumber$ = of(joNumber)
    })
  }

  public pieChartData = {
    labels: ["One", "Two", "Three", "Four", "Five"],
    datasets: [{
      data: [1, 2, 3, 4, 5],
      backgroundColor: ['red', 'orange', 'yellow', 'green', 'brown'],
      hoverBackgroundColor: ['darkred', 'darkorange', 'darkyellow', 'darkgreen', 'darkbrown']
    }]
  };

  public chartClicked(e: any) {
    const index = e.active[0].index + 1
    this.router.navigateByUrl("country/" + index)
  }
}
