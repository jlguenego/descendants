import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { FilterPeopleService, WikidataEntityOption } from 'src/app/filter-people.service';
import { EntityService } from 'src/app/entity.service';

const isWikiDataEntity = (control: AbstractControl): ValidationErrors => {
  if (!control.value.id) {
    return { hasNoId: true };
  }
  return null;
};

const getVal = (name: string | WikidataEntityOption) => (typeof name === 'string') ? name : name.name;

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
  filteredOptions: WikidataEntityOption[];

  constructor(
    private router: Router,
    private filterPeople: FilterPeopleService,
    private entity: EntityService
  ) { }

  ngOnInit() {
    this.updateFilter(this.f.value.name);

    this.f.valueChanges.pipe(debounceTime(600)).subscribe(val => {
      console.log('val', val);
      this.updateFilter({ name: this.f.value.name });
      if (this.f.valid) {
        console.log('this.f.value.name.id', this.f.value.name.id);
        this.entity.get(this.f.value.name.id).subscribe(json => { });
      }
    });

    this.f.valueChanges.subscribe(val => {
      console.log('val2', val);
      const name = getVal(val);
      console.log('name', name);
      this.filteredOptions = this.options.filter(o => o.name.includes(name));
      console.log('this.options', this.options);
      console.log('this.filteredOptions', this.filteredOptions);
    });
  }

  submit() {
    this.entity.setCurrent(this.f.value.name.id);
    this.router.navigateByUrl(`/stats/${this.f.value.name.id}`);
  }

  displayFn(option: WikidataEntityOption): string {
    return option.name;
  }

  updateFilter(entity: WikidataEntityOption) {
    console.log('updateFilter start with entity:', entity);
    const pattern = entity.name;
    console.log('pattern', pattern);
    this.filterPeople.filter(pattern).subscribe(options => {
      this.options = options;
      console.log('this.f.value.name', this.f.value.name);
      const name = getVal(this.f.value.name);
      console.log('name', name);
      this.filteredOptions = this.options.filter(o => o.name.includes(name));
      console.log('this.options', this.options);
      console.log('this.filteredOptions', this.filteredOptions);
    });

  }

  getYear(dateStr: string) {
    if (!dateStr) {
      return '';
    }
    return dateStr.substring(0, 4);
  }

}
