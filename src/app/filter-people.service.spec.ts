import { TestBed } from '@angular/core/testing';

import { FilterPeopleService } from './filter-people.service';

describe('FilterPeopleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterPeopleService = TestBed.get(FilterPeopleService);
    expect(service).toBeTruthy();
  });
});
