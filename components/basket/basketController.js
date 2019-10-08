import { BasketModel } from '../basket/basketModel.js';
import { BasketView } from '../basket/basketView.js';


class BasketController{
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.model = new BasketModel();
    this.view = new BasketView();

    this.eventManager.subscribe('Client bought the product', this.addNewProductToBasket.bind(this));

    this.hangEvents();
  }
  
  initBasketStatus() {
    this.model.initBasketStatus();
    this.renderBasketButton();
    this.view.renderBasketModalWindow(this.renderBasketContent.bind(this), this.renderPurchaseHistory.bind(this), this.renderOrderForm.bind(this));
  }

  renderBasketButton() {
    this.view.removeBasketButton();
    const basketContent = this.model.getBasketStatusProperty('content');
    this.view.renderBasketButton(basketContent.quantity, basketContent.totalPrice, this.openBasketModalWindow.bind(this));
  }

  addNewProductToBasket(productObj) {
    this.model.addProductToBasketStatus(productObj);
    this.renderBasketButton();
  }

  openBasketModalWindow() {
    this.renderBasketContent();
    this.view.openBasketModalWindow();
  }

  renderBasketContent() {
    this.view.clearBasketModalWindow();
    this.view.renderBasketContent(this.model.getBasketStatusProperty('content')
                                , this.increasePurchaseQuantity.bind(this)
                                , this.decreasePurchaseQuantity.bind(this));
  }
  renderPurchaseHistory() {
    this.view.clearBasketModalWindow();
    this.view.renderPurchaseHistory(this.model.getBasketStatusProperty('history'));
  }
  renderOrderForm() {
    this.view.clearBasketModalWindow();
    const currentOrder = this.model.getBasketStatusProperty('content');
    this.view.renderOrderForm(currentOrder.quantity, this.checkout.bind(this));
  }
  checkout(e) {
    e.preventDefault();
    const customersData =  this.view.getDataFromOrderFields();
    if(this.model.checkValidation(customersData) === true) {
      this.renderSuccessOrderForm(customersData);
      this.model.sendEmailConfirmationToCustomer(customersData);
      this.model.sendOrderToAdminByTelegram(customersData);
      this.model.addPurchaseToHistory();
      this.model.removeAllPurchasesFromBasket();
      this.renderBasketButton();
    }
  }

  renderSuccessOrderForm(customersData) {
    this.view.clearBasketModalWindow();
    this.view.renderSuccessOrderForm(customersData);
  }

  increasePurchaseQuantity(id) {
    this.eventManager.publish(`Purchase ${id} is increased`, 1);
    const basketContent = this.model.getBasketStatusProperty('content');
    this.view.updateFieldsOfPurchase(basketContent.products[id]);
    this.renderBasketButton();
  }
  decreasePurchaseQuantity(id, quantity) {
    this.eventManager.publish(`Purchase ${id} is decreased`, quantity);
    const currQuantity = this.model.decreasePurchaseQuantity(id, quantity);
    if(currQuantity === 0) {
      this.model.removePurchaseFromBasket(id);
      this.renderBasketContent()
    } else {
      const basketContent = this.model.getBasketStatusProperty('content');
      this.view.updateFieldsOfPurchase(basketContent.products[id]);
    }
    this.renderBasketButton();
  }

  saveBasketStatus() {
    this.model.saveBasketStatus();
  }

  hangEvents() {
    this.view.hangEvents(this.saveBasketStatus.bind(this));
  }
}

export { BasketController }