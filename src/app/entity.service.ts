import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  cache: any;
  id: string;

  constructor(private sparql: SparqlService) { 
    this.syncCache();
    if (Object.keys(this.cache).length > 0) {
      this.id = Object.keys(this.cache)[0];
    }
  }


  setCurrent(id) {
    this.id = id;
  }

  getCurrent(): string {
    return this.id;
  }

  syncCache() {
    if (!this.cache) {
      const str = localStorage.getItem('cache');
      if (!str) {
        this.cache = {};
      } else {
        this.cache = JSON.parse(str);
      }
    } else {
      localStorage.setItem('cache', JSON.stringify(this.cache));
    }
  }

  get(id: string) {
    if (this.cache[id]) {
      return of(this.cache[id]);
    }
    console.log('get id', id);
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
      this.syncCache();
      return json;
    }));
  }

}
