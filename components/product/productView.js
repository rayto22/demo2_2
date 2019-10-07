import { Templater } from '../templater/templater.js';

class ProductView{
  constructor() {
    this.templater = new Templater;

    
    this.domStorage = {
      productListContainer: {
        divDOM: document.querySelector('.product_list')
      }
    }
  }

  clearProductListContainer(){
    this.domStorage.productListContainer.divDOM.innerHTML = '';
  }
}

export { ProductView };