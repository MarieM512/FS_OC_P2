import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { map } from 'rxjs';
import { LineChartData } from '../models/LineChartData';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getOlympicById(olympicId: number): Observable<Olympic> {
    return this.olympics$.pipe(
      map(data => data.find(item => item.id === olympicId)),
      map(data => {
        if (!data) {
          throw new Error();
        } else {
          return data;
        }
      })
    );
  }

  getCountriesList(): string[] {
    let countries: string[] = []
    this.olympics$.forEach(olympics => {
      olympics.forEach(olympic => {
        countries.push(olympic.country)
      })
    })
    return countries
  }

  getNumberOfJO(): Observable<number[]> {
    let joNumber: number[] = []
    this.olympics$.forEach(olympics => {
      olympics.forEach(olympic => {
        olympic.participations.forEach(item => {
          if (!joNumber.includes(item.year)) {
            joNumber.push(item.year)
          }
        })
      })
    })
    return of(joNumber)
  }

  getOlympicInfo(olympic: Observable<Olympic>, info: 'medalsCount' | 'athleteCount'): Observable<number> {
    return olympic.pipe(
      map(olympic => olympic.participations.reduce(
          (previousValue, currentValue) => previousValue + currentValue[info], 0
        )
      )
    )
  }

  getYearsList(olympic: Observable<Olympic>): string[] {
    let years: string[] = []
    olympic.forEach(item => {
      item.participations.forEach(data => {
        years.push(String(data.year))
      })
    })
    return years
  }

  getMedalsList(olympic: Observable<Olympic>): number[] {
    let medals: number[] = []
    olympic.forEach(item => {
      item.participations.forEach(data => {
        medals.push(data.medalsCount)
      })
    })
    return medals
  }

  getLineChartData(olympic: Observable<Olympic>): LineChartData[] {
    let list: LineChartData[] = []
    olympic.forEach(item => {
      let lineChartData = new LineChartData(this.getMedalsList(olympic), item.country)
      list.push(lineChartData)
    })
    return list
  }

  getPieChartData(): number[] {
    let list: number[] = []
    this.olympics$.forEach(olympics => {
      olympics.forEach(olympic => {
        let medals = 0
        olympic.participations.forEach(item => {
          medals += item.medalsCount
        })
        list.push(medals)
      })
    })
    return list
  }
}
