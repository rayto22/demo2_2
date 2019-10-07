class BasketModel{
  constructor() {}

  initBasketStatus() {
    // localStorage.removeItem('basketStatus');
    const basketStatus = localStorage.getItem('basketStatus');
    if(Boolean(basketStatus) === false || basketStatus === 'undefined'){
      localStorage.setItem('basketStatus', JSON.stringify(
        {
          content: {
            quantity: 0,
            totalPrice: 0,
            products: {}
          },
          history: [],
          confirmOrder: {}
        }
      ));
    }
    this.basketStatus = JSON.parse(localStorage.getItem('basketStatus'));
  }

  addProductToBasketStatus(productObj) {
    productObj.product.quantity = productObj.purchased;
    this.basketStatus.content.quantity += productObj.product.quantity;
    this.basketStatus.content.totalPrice += productObj.product.price * productObj.purchased;

    if(this.basketStatus.content.products.hasOwnProperty(productObj.product.id)){
      this.basketStatus.content.products[productObj.product.id].quantity += productObj.purchased;
    } else {
      this.basketStatus.content.products[productObj.product.id] = productObj.product;
    };
    localStorage.setItem('basketStatus', JSON.stringify(this.basketStatus));
  }

  getBasketStatusProperty(propertyName) {
    return this.basketStatus[propertyName];
  }

  decreasePurchaseQuantity(id, quantity) {
    this.basketStatus.content.quantity -= quantity;
    this.basketStatus.content.totalPrice -= this.basketStatus.content.products[id].price * quantity;
    return this.basketStatus.content.products[id].quantity -= quantity;
  }

  removePurchaseFromBasket(id) {
    delete this.basketStatus.content.products[id];
  }

  saveBasketStatus() {
    localStorage.setItem('basketStatus', JSON.stringify(this.basketStatus));
  }

}

export { BasketModel };