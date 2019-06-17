import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { map } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';

export interface WikidataEntityOption {
  name: string;
  description?: string;
  id?: string;
  image?: string;
  thumbnail?: string;
  dob?: string;
  dod?: string;
}

const getEntityId = url => url.replace('http://www.wikidata.org/entity/', '');
const getImageUrl = url => {
  const str = decodeURIComponent(url.replace('http://commons.wikimedia.org/wiki/Special:FilePath/', ''));
  const imageName = str.replace(/ /g, '_');
  const checksum = Md5.hashStr(imageName) as string;
  const a = checksum.substring(0, 1);
  const ab = checksum.substring(0, 2);
  return `https://upload.wikimedia.org/wikipedia/commons/${a}/${ab}/${imageName}`;
};
const getThumbnailUrl = url => {
  const str = decodeURIComponent(url.replace('http://commons.wikimedia.org/wiki/Special:FilePath/', ''));
  const imageName = str.replace(/ /g, '_');
  return `https://commons.wikimedia.org/w/thumb.php?width=320&f=${imageName}`;
};


@Injectable({
  providedIn: 'root'
})
export class FilterPeopleService {

  constructor(private sparql: SparqlService) { }

  filter(pattern: string): Observable<WikidataEntityOption[]> {
    return this.sparql.query(`
    SELECT ?h ?hLabel ?hDescription ?nationalityLabel ?image ?dob ?dod
WHERE {
  {
    SELECT ?h ?label ?nationality ?image (MIN(?birthday) AS ?dob) (MIN(?deathday) AS ?dod) WHERE {
      VALUES ?nationality { wd:Q70972 wd:Q142 wd:Q31929 wd:Q146246 }
      ?h wdt:P31 wd:Q5.
      ?h wdt:P27 ?nationality.
      ?h wdt:P569 ?birthday.
      ?h rdfs:label ?label.
      ?h wdt:P97 ?titreNoblesse.
      ?h wdt:P18 ?image.
      ?h wdt:P570 ?deathday.
      FILTER(CONTAINS(LCASE(?label), LCASE("${pattern}"))).
      FILTER(LANG(?label) = "fr").
      FILTER(?deathday < "1950-01-01"^^xsd:dateTime).
    }
    GROUP BY ?h ?label ?nationality ?image
    LIMIT 7
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr" }
}
ORDER BY ?hLabel
`).pipe(map(obj => {
      console.log('obj', obj);
      return obj.results.bindings.map(result => {
        const description = result.hDescription ? result.hDescription.value : '<aucune description>';
        return {
          name: result.hLabel.value,
          description,
          id: getEntityId(result.h.value),
          image: getImageUrl(result.image.value),
          thumbnail: getThumbnailUrl(result.image.value),
          dob: result.dob.value,
          dod: result.dod.value,
        };

      });
    }));
  }
}
