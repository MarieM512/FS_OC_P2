import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Observable, filter, map, of, tap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([])
  // public countries: String[] = []
  public medalsNumber: number[] = []

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public pieChartType: ChartType = 'pie';

  public countries$: Observable<String[]> = of([])

  

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(
      map(data => data.map(item => new Olympic(item.id, item.country, item.participations)))
    )

    

    // this.olympics$.subscribe(item => {
    //   item.forEach(value => {
    //     this.countries.push(value.country)
    //   })
    //   item.forEach(value => {
    //     let medals = 0
    //     value.participations.forEach(participation => {
    //       medals += participation.medalsCount
    //     })
    //     this.medalsNumber.push(medals)
    //   })
    //   console.log(this.medalsNumber)
    // })
    // console.log(this.medalsNumber)

    this.olympics$.subscribe(item => {
      let countries: String[] = []
      item.forEach(value => {
        countries.push(value.country)
      })
      this.countries$ = of(countries)

      item.forEach(value => {
        let medals = 0
        value.participations.forEach(participation => {
          medals += participation.medalsCount
        })
        this.medalsNumber.push(medals)
      })
      // console.log(this.countries$)
      console.log(this.medalsNumber)
      this.pieChartData.datasets.forEach(value => {
        value.data = this.medalsNumber
      })
    })
    // console.log(this.medalsNumber)
  }

  // getLabels(): String[] {
  //   return this.countries
  // }

  getMedals(): number[] {
    return this.medalsNumber
  }

  public pieChartData = 
  {
    // labels: ["Italy", "France", "Germany", "Spain", "United State"],
    // labels: ,
    datasets: [{
      data: [1, 2, 3, 4, 5],
      // data: this.getMedals(),
      backgroundColor: ['red', 'orange', 'yellow', 'green', 'brown'],
      hoverBackgroundColor: ['darkred', 'darkorange', 'darkyellow', 'darkgreen', 'darkbrown']
    }]
  };

  
}
