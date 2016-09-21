import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-prototype',
  templateUrl: 'prototype.component.html',
  styleUrls: ['prototype.component.css']
})
export class PrototypeComponent implements OnInit {
  
  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    console.log('init');
  }

  goBack(event: Event) {
    console.log(this.route.params);
    this.router.navigate([''], { relativeTo: this.route });
    return false;    
  }

  goNext(event: Event) {
    this.router.navigate(['details'], { relativeTo: this.route });
    return false;
  }

}
