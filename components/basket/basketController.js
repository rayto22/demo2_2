import { BasketModel } from '../basket/basketModel.js';
import { BasketView } from '../basket/basketView.js';


class BasketController{
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.model = new BasketModel();
    this.view = new BasketView(this);

    this.eventManager.subscribe('Client bought the product', this.addNewProductToBasket.bind(this));
  }
  
  initBasketStatus() {
    this.model.initBasketStatus();
    this.renderBasketButton();
    this.view.renderBasketModalWindow();
  }

  renderBasketButton() {
    this.view.removeBasketButton();
    const basketContent = this.model.getBasketStatusProperty('content');
    this.view.renderBasketButton(basketContent.quantity, basketContent.totalPrice);
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
    this.view.renderBasketContent(this.model.getBasketStatusProperty('content'));
  }
  renderPurchaseHistory() {
    this.view.clearBasketModalWindow();
    this.view.renderPurchaseHistory();
  }
  renderOrderForm() {
    this.view.clearBasketModalWindow();
    this.view.renderOrderForm();
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
}

export { BasketController }