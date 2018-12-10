import {Component, Input, OnInit} from '@angular/core';
import { Coffee } from '../coffee';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CoffeeService }  from '../coffee.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})

export class HeroDetailComponent implements OnInit {

  @Input() coffee: Coffee;

  constructor(
    private route: ActivatedRoute,
    private coffeeService: CoffeeService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getCoffee();
  }

  getCoffee(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.coffeeService.getCoffee(id)
      .subscribe(coffee => this.coffee = coffee);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.coffeeService.updateCoffee(this.coffee)
      .subscribe(() => this.goBack());
  }

}
