import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { SparqlService } from 'src/app/sparql.service';
import { debounceTime } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

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

const isWikiDataEntity = (control: AbstractControl): ValidationErrors => {
  if (!control.value.id) {
    return { hasNoId: true};
  }
  return null;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  f = new FormGroup({
    name: new FormControl({
      name: 'Saint Louis',
      description: 'Roi de France',
      id: 'Q346',
      image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Premier_sceau_de_majesté_de_Louis_IX_détouré.png',
      thumbnail: 'https://commons.wikimedia.org/w/thumb.php?width=160&f=Premier_sceau_de_majesté_de_Louis_IX_détouré.png',
      dob: '1214-05-02T00:00:00Z',
      dod: '1270-09-01T00:00:00Z',
    }, [Validators.required, isWikiDataEntity])
  });

  options: WikidataEntityOption[];
  constructor(
    private router: Router,
    private sparql: SparqlService) { }

  ngOnInit() {
    this.updateFilter(this.f.value.name);

    this.f.valueChanges.pipe(debounceTime(600)).subscribe(val => {
      console.log('val', val);
      this.updateFilter({ name: this.f.value.name });
    });
  }

  submit() {
    this.router.navigateByUrl('/stats');
  }

  displayFn(option: WikidataEntityOption): string {
    return option.name;
  }

  updateFilter(entity: WikidataEntityOption) {
    console.log('updateFilter start with entity:', entity);
    const pattern = entity.name;
    console.log('pattern', pattern);
    this.sparql.query(`
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
`).subscribe(obj => {
      console.log('obj', obj);
      this.options = obj.results.bindings.map(result => {
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
    });
  }

  getYear(dateStr: string) {
    if (!dateStr) {
      return '';
    }
    return dateStr.substring(0, 4);
  }

}
