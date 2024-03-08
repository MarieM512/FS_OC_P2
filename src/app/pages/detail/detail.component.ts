import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const olympicId = +this.route.snapshot.params["id"]
    // console.log(this.olympicService.getOlympicById(olympicId))
    this.olympic$ = this.olympicService.getOlympicById(olympicId)
    this.medalsNumber = this.olympicService.getOlympicInfo(this.olympic$, "medals")
    this.athletesNumber = this.olympicService.getOlympicInfo(this.olympic$, "athletes")
  }

}
