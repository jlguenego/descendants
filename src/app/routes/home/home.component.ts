import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SparqlService } from 'src/app/sparql.service';
import { debounceTime } from 'rxjs/operators';

export interface WikidataEntityOption {
  name: string;
  description: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  f = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  options: WikidataEntityOption[] = [
    { name: 'Saint Louis', description: 'Roi de France' },
    { name: 'Clovis', description: 'Roi des Francs' },
  ];
  constructor(
    private router: Router,
    private sparql: SparqlService) { }

  ngOnInit() {
    // this.updateFilter(this.f.value.name);

    this.f.valueChanges.pipe(debounceTime(600)).subscribe(val => {
      console.log('val', val);
      this.updateFilter(this.f.value.name);
    });
  }

  submit() {
    this.router.navigateByUrl('/stats');
  }

  displayFn(option: WikidataEntityOption): string {
    return option.name;
  }

  updateFilter(pattern) {
    this.sparql.query(`
    SELECT ?h ?hLabel ?hDescription ?nationalityLabel
    WHERE {
      {
        SELECT DISTINCT ?h ?label ?nationality WHERE {
          VALUES ?nationality { wd:Q70972 wd:Q142  }
          ?h wdt:P31 wd:Q5.
          ?h wdt:P27 ?nationality.
          ?h wdt:P569 ?dob.
          ?h rdfs:label ?label.
          ?h wdt:P97 ?titreNoblesse.
          FILTER(CONTAINS(?label, "${pattern}")).
          FILTER(LANG(?label) = "fr").
          FILTER(?dob < "1850-01-01"^^xsd:dateTime).
        }
        LIMIT 7
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr" }
    }
    ORDER BY ?hLabel
`).subscribe(obj => {
      console.log('obj', obj);
      this.options = obj.results.bindings.map(result => {
        if (!result.hDescription) {
          return {
            name: result.hLabel.value,
            description: '<aucune description>',
          };
        }
        return {
          name: result.hLabel.value,
          description: result.hDescription.value,
        };
      });
    });
  }

}
