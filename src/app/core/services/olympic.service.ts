import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { map } from 'rxjs';

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

  getOlympicInfo(olympic: Observable<Olympic>, info: "medals" | "athletes"): number {
    let number = 0
    olympic.forEach(item => {
      item.participations.forEach(data => {
        if (info === "medals") {
          number = number + data.medalsCount
        } else {
          number = number + data.athleteCount
        }
      })
    })
    return number
  }
}
