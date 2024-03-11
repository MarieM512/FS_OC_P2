import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Series } from '@swimlane/ngx-charts';
import { Observable, map } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  olympic$!: Observable<Olympic>
  medalsNumber$!: Observable<number>
  athletesNumber$!: Observable<number>
  lineChartData$!: Observable<Series[]>
  xAxis: boolean = true;
  yAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const olympicId = +this.route.snapshot.params["id"]
    this.olympic$ = this.olympicService.getOlympicById(olympicId)
    this.medalsNumber$ = this.olympicService.getOlympicInfo(this.olympic$, "medalsCount")
    this.athletesNumber$ = this.olympicService.getOlympicInfo(this.olympic$, "athleteCount")
    this.lineChartData$ = this.olympic$.pipe(
      map(olympic => this.olympicService.getLineChartData(olympic))
    );
  }
}
