import { Templater } from '../templater/templater.js';
import { EventManager } from '../eventManager/eventManager.js'
import { ProductController } from '../product/productController.js';
import { FilterController } from '../filter/filterController.js';
import { SortController } from '../sort/sortController.js';
import { BasketController } from '../basket/basketController.js';


class Mediator {
  constructor() {
    this.eventManager = new EventManager();
    this.eventManager.subscribe('All templates was loaded', this.initPage.bind(this));
    this.templater = new Templater(this.eventManager);
  }

  initPage() {
    this.eventManager.unsubscribe('All templates was loaded', this.initPage.bind(this));
    this.filter = new FilterController(this.eventManager);
    this.sort = new SortController(this.eventManager);
    this.product = new ProductController(this.eventManager);
    this.basket = new BasketController(this.eventManager);

    this.product.getProductList().then(() => {
      this.basket.initBasketStatus();
      this.filter.initFilterStatus();
      this.sort.initSortStatus();
      this.buildProductList();
      this.eventManager.subscribe('request to rebuild product list', this.buildProductList.bind(this));
    });
  }

  buildProductList() {
    let prodArr = JSON.parse(localStorage.getItem('productList'));
    prodArr = this.filter.filterProductList(prodArr);
    this.sort.sortProductList(prodArr);
    
    this.product.renderProductList(prodArr);
  }
}

export { Mediator };