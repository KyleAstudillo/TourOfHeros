import { Component, OnInit } from '@angular/core';
import { Coffee } from '../coffee';
import { CoffeeService } from '../coffee.service';

import { OktaAuthService } from '@okta/okta-angular';
import { MessageService} from "../message.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  coffees: Coffee[] = [];

  constructor(private coffeeService: CoffeeService, private oktaAuth: OktaAuthService, private messageService: MessageService) { }

  async ngOnInit() {
    this.getHeroes();
    const accessToken = await this.oktaAuth.getAccessToken();
    this.coffeeService.setAuth(accessToken);
    this.messageService.add(accessToken);
  }

  getHeroes(): void {
    this.coffeeService.getCoffees()
      .subscribe(coffees => this.coffees = coffees.slice(1, 5));
  }
}
