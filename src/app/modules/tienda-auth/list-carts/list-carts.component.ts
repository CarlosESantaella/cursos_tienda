import { Component, ElementRef, ViewChild } from '@angular/core';
import { CartService } from '../../tienda-guest/service/cart.service';

declare var paypal: any;

@Component({
  selector: 'app-list-carts',
  templateUrl: './list-carts.component.html',
  styleUrls: ['./list-carts.component.css'],
})
export class ListCartsComponent {
  listCarts: any = [];
  totalSum: number = 0;
  code: any = null;

  @ViewChild('paypal', { static: true }) paypalElement?: ElementRef;

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.cartService.currentData$.subscribe((resp: any) => {
      this.listCarts = resp;
      this.totalSum = this.listCarts.reduce(
        (sum: number, item: any) => sum + item.total,
        0
      );
    });
    setTimeout(() => {

      paypal
        .Buttons({
          // optional styling for buttons
          // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
          style: {
            color: 'gold',
            shape: 'rect',
            layout: 'vertical',
          },
  
          // set up the transaction
          createOrder: (data: any, actions: any) => {
            // pass in any options from the v2 orders create call:
            // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
  
            if(this.totalSum == 0){
              alert("NO PUEDES PAGAR UN MONTO DE 0");
              return false;
            }
  
            if(this.listCarts.length == 0){
              alert("NO PUEDES PROCESAR EL PAGO CON NINGUN CURSO EN EL CARRITO");
              return false;
            }
  
            const createOrderPayload = {
              purchase_units: [
                {
                  amount: {
                    description: 'COMPRAR POR EL ECOMMERCE',
                    value: this.totalSum,
                  },
                },
              ],
            };
  
            return actions.order.create(createOrderPayload);
          },
  
          // finalize the transaction
          onApprove: async (data: any, actions: any) => {
            let Order = await actions.order.capture();
  
            // Order.purchase_units[0].payments.captures[0].id
            let dataT = {
              method_payment: "PAYPAL",
              currency_total: "USD",
              currency_payment: "USD",
              total: this.totalSum,
              n_transaccion: Order.purchase_units[0].payments.captures[0].id
  
            }
            this.cartService.checkout(dataT).subscribe((resp:any) => {
              console.log(resp);
            });
            // return actions.order.capture().then(captureOrderHandler);
          },
  
          // handle unrecoverable errors
          onError: (err: any) => {
            console.error(
              'An error prevented the buyer from checking out with PayPal'
            );
          },
        })
        .render(this.paypalElement?.nativeElement);
    }, 500);
  }

  getNameCampaing(type: number) {
    let Name = '';
    switch (type) {
      case 1:
        Name = 'CAMPAÑA NORMAL';
        break;
      case 2:
        Name = 'CAMPAÑA FLASH';
        break;
      case 3:
        Name = 'CAMPAÑA BANNER';
        break;
    }
    return Name;
  }

  removeItem($event: any, cart: any) {
    $event.preventDefault();
    this.cartService.deleteCart(cart.id).subscribe((resp: any) => {
      console.log(resp);
      alert('ITEM DEL CARRITO ELIMINADO CORRECTAMENTE');
      this.cartService.removeItemCart(cart);
    });
  }

  applyCoupon() {
    if (!this.code) {
      alert('NECESITAS INGRESAR UN CUPON');
      return;
    }
    let data = {
      code: this.code,
    };
    this.cartService.applyCoupon(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        alert(resp.message_text);
      } else {
        this.cartService.resetCart();
        setTimeout(() => {
          resp.carts.data.forEach((cart: any) => {
            this.cartService.addCart(cart);
          });
        }, 50);
        alert('EL CUPON SE HA REGISTRADO CORRECTAMENTE');
      }
    });
  }
}
