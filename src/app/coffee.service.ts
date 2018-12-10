import {Injectable, OnInit} from '@angular/core';
import { Coffee } from './coffee';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


var httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization":"Not"})
};


@Injectable({
  providedIn: 'root'
})


export class CoffeeService{

  private serviceURL = 'https://oodservercloudserver.azurewebsites.net/api/coffee'

  private customOptions;

  private accesstoken;

  constructor(private http: HttpClient,
              private messageService: MessageService) { }


  public setAuth(accesstoken: string){
    this.accesstoken = accesstoken;
    this.customOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": `Bearer ${accesstoken}`})};
  }

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
    this.log("INFO update: " + coffee.name)
    let urlOptions  = `?id=${coffee.id}&name=${coffee.name}&imageLink1=${coffee.imageLink1}&imageLink2=${coffee.imageLink2}&userId=${coffee.userId}&coffeeId=${coffee.coffeeId}`
    let customURL = this.serviceURL + urlOptions;
    return this.http.post<Coffee>(customURL, coffee, this.customOptions).pipe(
      tap((coffee: Coffee) => this.log(`updated coffee id=${coffee.id}`)),
      catchError(this.handleError<Coffee>('updateCoffee'))
    );
  }

  /** POST: add a new coffee to the server */
  addCoffee (coffee: Coffee): Observable<Coffee> {
    this.log("INFO add: " + coffee.name)
    let urlOptions  = `?id=${coffee.id}&name=${coffee.name}&imageLink1=${coffee.imageLink1}&imageLink2=${coffee.imageLink2}&userId=${coffee.userId}&coffeeId=${coffee.coffeeId}`
    let customURL = this.serviceURL + urlOptions;
    return this.http.post<Coffee>(customURL, coffee, this.customOptions).pipe(
      tap((coffee: Coffee) => this.log(`added coffee w/ id=${coffee.id}`)),
      catchError(this.handleError<Coffee>('addCoffee'))
    );
  }

  /** DELETE: delete the coffee from the server */
  deleteCoffee (coffee: Coffee | number): Observable<Coffee> {
    const id = typeof coffee === 'number' ? coffee : coffee.id;
    const url = `${this.serviceURL}/${id}`;
    this.log("INFO Delete: " + url);
    httpOptions = this.customOptions
    return this.http.delete<Coffee>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted coffee id=${id}`)),
      catchError(this.handleError<Coffee>('deleteCoffee'))
    );
  }

  /** DELETE: delete the coffee from the server */
  deleteCoffee2 (coffee: Coffee): Observable<Coffee> {
    const id = coffee.id;
    const url = `${this.serviceURL}/${id}`;
    this.log("INFO Delete: " + url);
    const options = this.customOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json', "Authorization": `Bearer ${this.accesstoken}`})};
    return this.http.delete<Coffee>(url, options).pipe(
      tap(_ => this.log(`deleted coffee id=${id}`)),
      catchError(this.handleError<Coffee>('deleteCoffee'))
    );
  }

  /* GET coffees whose name contains search term */
  searchCoffees(term: string): Observable<Coffee[]> {
    if (!term.trim()) {
      // if not search term, return empty coffee array.
      return of([]);
    }
    return this.http.get<Coffee[]>(`${this.serviceURL}/?name=${term}`).pipe(
      tap(_ => this.log(`found coffees matching "${term}"`)),
      catchError(this.handleError<Coffee[]>('searchCoffees', []))
    );
  }


}
