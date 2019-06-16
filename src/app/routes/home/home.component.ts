import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor(private router: Router) { }

  ngOnInit() {
  }

  submit() {
    this.router.navigateByUrl('/stats');
  }

}
