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

  checkValidation(customersData) {
    return true;
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

  sendEmailConfirmationToCustomer(customersData) {
    const url = 'http://so2niko.zzz.com.ua/ss/api.php?data=';
    this.tempStorageForPurchase = Object.assign({}, this.basketStatus.content)
    const data = {
      'mail': customersData.email,
      'name': `${customersData.name} ${customersData.surname}`,
      'total_price': this.tempStorageForPurchase.totalPrice,
      'purchase_data': []
    };

    data.purchase_data = Object.values(this.tempStorageForPurchase.products).map((prod) => {
      return {
        'name': prod.name,
        'quantity': prod.quantity,
        'price': prod.quantity * prod.price
      }
    });
    fetch(url + JSON.stringify(data), {mode:'no-cors'});
  }

  sendOrderToAdminByTelegram(customersData) {
    const botToken = '911075884:AAFIMdmfpRGZu6hqta-Mkh4Nzgp-GkVa0Qc';
    const chatId = '345805296';
    let mess = `We have an order. %0A
    Customer: ${customersData.name} ${customersData.surname} %0A
    Phone: ${customersData.phone} %0A
    Email: ${customersData.email} %0A
    Destination point: ${customersData.destination} %0A %0A`;

    Object.values(this.tempStorageForPurchase.products).forEach((prod) => {
      mess += `${prod.name} (${prod.quantity}) for ${prod.quantity * prod.price} $ %0A`;
    });

    mess += `%0A Total cost: ${this.tempStorageForPurchase.totalPrice} $`

    if(customersData.message !== '') {
      mess += `%0A Message from client: ${customersData.message}`;
    }

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${mess}`);
  }

  addPurchaseToHistory() {
    this.basketStatus.history = this.basketStatus.history.concat(Object.values(this.basketStatus.content.products));
  }

  removeAllPurchasesFromBasket() {
    this.basketStatus.content = {
      quantity: 0,
      totalPrice: 0,
      products: {}
    };
  }
}

export { BasketModel };