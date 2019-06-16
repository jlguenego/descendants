import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SparqlService } from 'src/app/sparql.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  f = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  options = ['Saint-Louis', 'Clovis'];
  constructor(
    private router: Router,
    private sparql: SparqlService) { }

  ngOnInit() {
    this.updateFilter();
  }

  submit() {
    this.router.navigateByUrl('/stats');
  }

  updateFilter() {
    const text = 'Jean';
    this.sparql.query(`
    SELECT ?h ?hLabel ?hDescription
WHERE {
  {
    SELECT DISTINCT ?h ?label WHERE {
      ?h wdt:P31 wd:Q5.
      ?h wdt:P569 ?dob.
      ?h rdfs:label ?label.
      FILTER(CONTAINS(?label, "${this.f.value.name}")).
      FILTER(LANG(?label) = "fr").
      FILTER(?dob < "1801-01-01"^^xsd:dateTime).
    }
    LIMIT 10
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr" }
}
`).subscribe(obj => {
      console.log('obj', obj);
      this.options = obj.results.bindings.map(result => result.hLabel.value);
    });
  }

}
