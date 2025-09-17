import { Component, Inject, OnInit } from '@angular/core';
import { ShoppingCart } from '../../models/shopping-cart.model';
import { ShoppingCartService } from '../../services/shopping-cart-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/orderService';
import { CookieService } from 'ngx-cookie-service';
import { TuiAlertService } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { FeatureManager } from '../feature-manager';
import { FeatureService } from '../../services/features.service';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent extends FeatureManager implements OnInit {
  private shoppingCart = new ShoppingCart([]);
  checkoutForm!: FormGroup;
  paymentMethods = ['PayPal', 'MBWay', 'Visa', 'Mastercard'];
  shippingMethods = ['CTT', 'PickUp'];
  payment = [
    { name: 'Paypal', image: 'assets/images/payment/paypal.png' },
    { name: 'Visa', image: 'assets/images/payment/visa.png' },
    { name: 'Mastercard', image: 'assets/images/payment/mastercard.png' },
    { name: 'MBWay', image: 'assets/images/payment/mbway.png' },
  ];
  shipping = [
    { name: 'CTT', image: 'assets/images/shipping/ctt.png' },
    { name: 'PickUp', image: 'assets/images/shipping/pickup.png' },
  ];

  constructor(
    private shoppingCartService: ShoppingCartService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private cookieService: CookieService,
    @Inject(TuiAlertService) private readonly alerts: TuiAlertService,
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
    this.checkoutForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      shippingMethod: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      shippingAddress: ['', Validators.required],
      dataConsent: [false, Validators.requiredTrue],
    });
  }

  checkout(): void {
    if (this.checkoutForm.valid) {
      // Process the form data (e.g., send to a backend service)
      const order = {
        paymentMethod: this.checkoutForm.value.paymentMethod.name,
        totalPrice: this.getTotal(),
        shippingMethod: this.checkoutForm.value.shippingMethod.name,
        shippingAddress: this.checkoutForm.value.shippingAddress,
        email: this.checkoutForm.value.email,
        orderStatus: 'Pending',
        receiptName: this.checkoutForm.value.name,
        userNif: this.cookieService.get('userNif'),
        weapons: this.shoppingCart.items.map((i) => {
          return i.weapon.name;
        }),
        dataConsent: this.checkoutForm.value.dataConsent,
      };
      this.orderService.createOrder(order).subscribe(
        (response) => {
          this.alerts
            .open('Order created successfully', {
              status: 'success',
            })
            .subscribe();
          this.shoppingCartService.clearCart();
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        },
        (error) => {
          console.error('Order error:', error);
        }
      );
    }
  }

  getTotal(): number {
    return this.shoppingCart.items.reduce((acc: number, item) => {
      const itemTotal = item.weapon.price * item.quantity;
      return acc + itemTotal;
    }, 0);
  }
}
