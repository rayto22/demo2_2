import { ProductCardModel } from '../productCard/productCardModel.js';
import { ProductCardView } from '../productCard/productCardView.js';

class ProductCardController {
  constructor(prodData, eventManager) {
    this.eventManager = eventManager;
    this.model = new ProductCardModel(prodData);
    this.view = new ProductCardView(this);

    this.eventManager.subscribe(`Purchase ${prodData.id} is increased`, this.buyProduct.bind(this));
    this.eventManager.subscribe(`Purchase ${prodData.id} is decreased`, this.returnProduct.bind(this));
  }

  removeProductCard() {
    const productId = this.model.getProductData('id');
    this.view.removeProductCard(productId);
  }

  renderProductCard() {
    const productData = this.model.getProductData();
    this.view.renderProductCard(productData);
  }

  buyProduct(quantity) {
    let purchased;
    if(arguments.length === 0){
      purchased = Number(this.view.getPurchasedQuantity());
    } else {
      purchased = quantity;
    }
    const onSale = this.model.getProductData('quantity');
    if(this.model.checkPossibilityToSell(purchased, onSale)) {
      this.model.setProductDataProperty('quantity', onSale - purchased);
      this.model.saveNewDataToLocalStorage('quantity');
      const newProdData = this.model.getProductData();
      const purchaseData = {
        product: Object.assign({}, newProdData),
        purchased: purchased
      };
      this.view.updateFieldsOfProductCard(newProdData);
      this.eventManager.publish('Client bought the product', purchaseData);
    }
  }

  returnProduct(quantity) {
    const prodData = this.model.getProductData();
    this.model.setProductDataProperty('quantity', prodData.quantity + quantity);
    this.view.updateFieldsOfProductCard(prodData);
    this.model.saveNewDataToLocalStorage('quantity');
  }

  openModalWindowAddInfo() {
    this.view.renderModalWindowAddInfo();
  }

}

export { ProductCardController };