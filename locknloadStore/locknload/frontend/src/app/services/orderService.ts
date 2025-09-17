import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { OrderDTO } from '../dto/orderDTO';
import { CheckoutDTO } from '../dto/checkoutDTO';
import { ConfigService } from '../config/config.service';
import { CookieService } from 'ngx-cookie-service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService {
  constructor(http: HttpClient, configService: ConfigService) {
    super(http, configService);
  }

  getOrders(): Observable<OrderDTO[]> {
    return this.get<OrderDTO[]>('order');
  }

  createOrder(order: CheckoutDTO): Observable<any> {
    return this.post<any>('order', order);
  }
}
