import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SparqlService {

  constructor(private http: HttpClient) { }

  query(queryStatement: string) {
    const encodedStatement = encodeURIComponent(queryStatement);
    console.log('encodedStatement', encodedStatement);
    return this.http.get<any>(`https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=${encodedStatement}`);
  }
}
