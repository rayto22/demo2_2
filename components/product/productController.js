import { ProductModel } from '../product/productModel.js';
import { ProductView } from '../product/productView.js';
import { ProductCardController } from '../productCard/productCardController.js';

class ProductController{
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.model = new ProductModel(this.eventManager);
    this.view = new ProductView();
    
    this.products = {};
    this.eventManager.subscribe('Products were received', this.startProductsFactory.bind(this));
  }

  renderProductList(prodArr) {
    console.log(2);
    Object.values(this.products).forEach((product) => {
      product.removeProductCard();
    })
    // this.view.clearProductListContainer();
    prodArr.forEach((product) => {
      this.products[product.id].renderProductCard();
    });
  }

  getProductList() {
    return this.model.getProductList();
  }

  startProductsFactory(d) {
    this.eventManager.unsubscribe('Products were received', this.startProductsFactory.bind(this));
    d.forEach((prodObj) => {
      this.products[prodObj.id] = new ProductCardController(prodObj, this.eventManager);
    });
  }

  
}

export { ProductController }