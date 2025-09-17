import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart-service.service';
import { Weapon } from '../../models/weapon.model';
import { ShoppingCart } from '../../models/shopping-cart.model';
import { Router } from '@angular/router';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent extends FeatureManager implements OnInit {
  shoppingCart = new ShoppingCart([]);

  constructor(
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    featureService: FeatureService
  ) {
    super(featureService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.shoppingCart.items = this.shoppingCartService.getItems();
    this.shoppingCartService.cartUpdated$.subscribe(() => {
      this.shoppingCart.items = this.shoppingCartService.getItems();
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  getTotal(): number {
    return this.shoppingCart.items.reduce((acc: number, item) => {
      const itemTotal = item.weapon.price * item.quantity;
      return acc + itemTotal;
    }, 0);
  }
}
