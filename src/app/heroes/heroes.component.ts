import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';
import { Coffee } from '../coffee';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  coffees: Coffee[];

  constructor(private coffeeService: CoffeeService) { }

  ngOnInit() {
    this.getCoffees()
  }

  getCoffees(): void {
    this.coffeeService.getCoffees()
      .subscribe(coffees => this.coffees = coffees);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.coffeeService.addCoffee({ name } as Coffee)
      .subscribe(coffee => {
        this.coffees.push(coffee);
      });
  }

  delete(coffee: Coffee): void {
    this.coffees = this.coffees.filter(h => h !== coffee);
    this.coffeeService.deleteCoffee(coffee).subscribe();
  }

}
