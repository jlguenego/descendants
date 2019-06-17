import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  constructor(private sparql: SparqlService) { }
  get(id: string) {
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
      return json;
    }));
  }

}
