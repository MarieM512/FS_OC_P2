import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { map } from 'rxjs';
import { LineChartData } from '../models/LineChartData';
import { PieChartData } from '../models/PieChartData';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Load data that permits to store olympic.json in olympics$
   */
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        this.olympics$.next([]);
        return throwError(() => new Error(error));
      })
    );
  }

  /**
   * Get all olympics
   */
  getOlympics() {
    return this.olympics$.asObservable();
  }

  /**
   * Get ID of specific country by its name
   * @param countryName 
   * @returns number that correspond to the ID of the country
   */
  getIdByName(countryName: string): number {
    let number: number = 0
    this.olympics$.forEach(olympics => {
      let olympic = olympics.find(olympic => olympic.country === countryName)
      if (olympic) {
        number = olympic.id
      }
    })
    return number
  }

  /**
   * Get specific olympic by its ID
   * @param olympicId 
   * @returns an observable of olympic
   */
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

  /**
   * Get the list of country that contains the name of country
   * @returns list of country name
   */
  getCountriesList(): string[] {
    let countries: string[] = []
    this.olympics$.forEach(olympics => {
      olympics.forEach(olympic => {
        countries.push(olympic.country)
      })
    })
    return countries
  }

  /**
   * Get number of participations of JO by each country
   * @returns an observable of number of JO
   */
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

  /**
   * Get number of medals or athletes of specific country
   * @param olympic 
   * @param info 
   * @returns an observable of number of medals or athlete
   */
  getOlympicInfo(olympic: Observable<Olympic>, info: 'medalsCount' | 'athleteCount'): Observable<number> {
    return olympic.pipe(
      map(olympic => olympic.participations.reduce(
          (previousValue, currentValue) => previousValue + currentValue[info], 0
        )
      )
    )
  }

  /**
   * Get list of years participations of specific country
   * @param olympic 
   * @returns list of years
   */
  getYearsList(olympic: Observable<Olympic>): string[] {
    let years: string[] = []
    olympic.forEach(item => {
      item.participations.forEach(data => {
        years.push(String(data.year))
      })
    })
    return years
  }

  /**
   * Get list of medals of specific country
   * @param olympic 
   * @returns list of medals
   */
  private getMedalsList(olympic: Observable<Olympic>): number[] {
    let medals: number[] = []
    olympic.forEach(item => {
      item.participations.forEach(data => {
        medals.push(data.medalsCount)
      })
    })
    return medals
  }

  /**
   * Get data for line chart
   * @param olympic 
   * @returns list of medals by country
   */
  getLineChartData(olympic: Observable<Olympic>): LineChartData[] {
    let list: LineChartData[] = []
    olympic.forEach(item => {
      let lineChartData = new LineChartData(this.getMedalsList(olympic), item.country)
      list.push(lineChartData)
    })
    return list
  }

  /**
   * Get data for pie chart
   * @returns list of participations by country
   */
  getPieChartData(): Observable<PieChartData[]> {
    return this.olympics$.pipe(
      map(olympics => 
        olympics.map(olympic => {
          return {
            name: olympic.country,
            value: olympic.participations.reduce(
              (previousValue, currentValue) => {
                return previousValue + currentValue.medalsCount
              }, 0
            )
          }
        })
      )
    )
  }
}
