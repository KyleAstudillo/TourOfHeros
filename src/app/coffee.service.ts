import { Injectable } from '@angular/core';
import { Coffee } from './coffee';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})


export class CoffeeService {

  private serviceURL = 'http://127.0.0.1:5000/api/coffee'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  /** Log a CoffeeService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CoffeeService: ${message}`);
  }

  /** GET coffees from the server */
  /** GET coffees from the server */
  getCoffees (): Observable<Coffee[]> {
    return this.http.get<Coffee[]>(this.serviceURL)
      .pipe(
        tap(_ => this.log('fetched coffee')),
        catchError(this.handleError('getCoffees', []))
      );
  }

  /** GET coffee by id. Will 404 if id not found */
  getCoffee(id: number): Observable<Coffee> {
    const url = `${this.serviceURL}/${id}`;
    return this.http.get<Coffee>(url).pipe(
      tap(_ => this.log(`fetched coffee id=${id}`)),
      catchError(this.handleError<Coffee>(`getCoffee id=${id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** PUT: update the coffee on the server */
  updateCoffee (coffee: Coffee): Observable<any> {

    return this.http.put(this.serviceURL, coffee, httpOptions).pipe(
      tap(_ => this.log(`updated coffee id=${coffee.id}`)),
      catchError(this.handleError<any>('updateCoffee'))
    );
  }

  /** POST: add a new coffee to the server */
  addCoffee (coffee: Coffee): Observable<Coffee> {
    return this.http.post<Coffee>(this.serviceURL, coffee, httpOptions).pipe(
      tap((coffee: Coffee) => this.log(`added coffee w/ id=${coffee.id}`)),
      catchError(this.handleError<Coffee>('addCoffee'))
    );
  }

  /** DELETE: delete the coffee from the server */
  deleteCoffee (coffee: Coffee | number): Observable<Coffee> {
    const id = typeof coffee === 'number' ? coffee : coffee.id;
    const url = `${this.serviceURL}/${id}`;

    return this.http.delete<Coffee>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted coffee id=${id}`)),
      catchError(this.handleError<Coffee>('deleteCoffee'))
    );
  }

  /* GET heroes whose name contains search term */
  searchCoffees(term: string): Observable<Coffee[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Coffee[]>(`${this.serviceURL}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Coffee[]>('searchCoffees', []))
    );
  }


}
