import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { retry, retryWhen, delay, flatMap } from "rxjs/operators";
import "rxjs/add/observable/of";
export interface Person {
  name: string;
}

@Injectable()
export class PeopleService {
  constructor(private http: HttpClient) {}

  fetchPeople(): Observable<Person> {
    // return this.http.get<Person>("/api/v1/peopleu").pipe(retry(3));
    return this.http.get<Person>("/api/v1/peopleu").pipe(
      retryWhen(err => {
        let retries = 3;
        return err.pipe(
          delay(1000),
          flatMap(err => {
            if (retries-- > 0) {
              return Observable.of(err);
            } else {
              return Observable.throw(err);
            }
          })
        );
      })
    );
  }
}
