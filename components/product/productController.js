import { ProductModel } from '../product/productModel.js';
import { ProductView } from '../product/productView.js';
import { ProductCardController } from '../productCard/productCardController.js';

class ProductController{
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.model = new ProductModel();
    this.view = new ProductView();
    
    this.products = {};
  }

  renderProductList(prodArr) {
    Object.values(this.products).forEach((product) => {
      product.removeProductCard();
    })
    prodArr.forEach((product) => {
      this.products[product.id].renderProductCard();
    });
  }

  getProductList() {
    return this.model.getProductList().then((d) => this.startProductsFactory(d));
  }

  startProductsFactory(d) {
    d.forEach((prodObj) => {
      this.products[prodObj.id] = new ProductCardController(prodObj, this.eventManager);
    });
  }

  
}

export { ProductController }