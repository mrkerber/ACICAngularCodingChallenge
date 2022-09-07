import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { RecentQuote } from './RecentQuote';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class RecentQuoteService {

  private recentQuoteURL = 'api/recentQuotes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET all recent quotes from the server */
  getAllRecentQuotes(): Observable<RecentQuote[]> {
    return this.http.get<RecentQuote[]>(this.recentQuoteURL)
    .pipe(
      tap(_ => this.log(`fetched ${_.length} recent quotes`)),
      catchError(this.handleError<RecentQuote[]>('getRecentQuotes', []))
    );
  }

  getRecentQuotes(lineOfBusinessId: number): Observable<RecentQuote[]> {
    //const url = `${this.recentQuoteURL}/${lineOfBusinessId}`
    return this.http.get<RecentQuote[]>(`${this.recentQuoteURL}/?lineOfBusiness=${lineOfBusinessId}`)
    .pipe(
      tap(_ => this.log(`fetched ${_.length} recent quotes for lineOfBusiness id=${lineOfBusinessId}`)),
      catchError(this.handleError<RecentQuote[]>(`getRecentQuotes where LineOfBusiness id=${lineOfBusinessId}`, []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a LineOfBusinessService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RecentQuoteService: ${message}`);
  }
}
