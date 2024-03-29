import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataItem } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>
  joNumber$!: Observable<number[]>
  pieChartData$! : Observable<DataItem[]>
  gradient: boolean = true
  showLegend: boolean = false
  showLabels: boolean = true
  maxLabelLenght = false

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics()
    this.joNumber$ = this.olympicService.getNumberOfJO()
    this.pieChartData$ = this.olympicService.getPieChartData()
  }

  /**
   * Change route to display information about specific country
   * @param e 
   */
  public chartClicked(e: DataItem) {
    const index = this.olympicService.getIdByName(e.name.toString())
    this.router.navigateByUrl("country/" + index)
  }
}
