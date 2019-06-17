import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  cache = {};
  id: string;

  constructor(private sparql: SparqlService) { }


  setCurrent(id) {
    this.id = id;
  }

  getCurrent(): string {
    return this.id;
  }

  get(id: string) {
    if (this.cache[id]) {
      return of(this.cache[id]);
    }
    return this.sparql.query(`
    SELECT ?item ?itemLabel (COUNT(?descendant) AS ?descendantCount)
    WHERE
    {
      VALUES ?item { wd:${id}  }
      ?item wdt:P40+ ?descendant
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    GROUP BY ?item ?itemLabel
    `).pipe(map(json => {
      console.log('json', json);
      this.cache[id] = json;
      return json;
    }));
  }

}
