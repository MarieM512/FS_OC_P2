import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { Observable } from 'rxjs';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  olympic$!: Observable<Olympic>
  medalsNumber!: number
  athletesNumber!: number
  labels!: string[]
  lineChartData!: LineChartData[]
  public lineChartType: ChartType = 'line';
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartLegend:boolean = false;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const olympicId = +this.route.snapshot.params["id"]
    this.olympic$ = this.olympicService.getOlympicById(olympicId)
    this.medalsNumber = this.olympicService.getOlympicInfo(this.olympic$, "medals")
    this.athletesNumber = this.olympicService.getOlympicInfo(this.olympic$, "athletes")
    this.labels = this.olympicService.getYearsList(this.olympic$)
    this.lineChartData = this.olympicService.getLineChartData(this.olympic$)
  }

}
