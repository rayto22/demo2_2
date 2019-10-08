import { Templater } from '../templater/templater.js';

class ProductCardView {
  constructor() {
    this.templater = new Templater;

    this.domStorage = {
      productListContainer: {
        divDOM: document.querySelector('.product_list')
      },
      productCard : {
        divDOM: false
      },
      modalWindowInfoContainer: {
        divDOM: document.querySelector('.modal_window_add_info_div')
      },
      modalWindowInfo: {
        divDOM: false
      }
    }
  }

  removeProductCard(productCardId) {
    this.templater.resetContainer(false, `productCardId${productCardId}`);
    if(this.domStorage.productCard.divDOM !== false){
      this.domStorage.productCard.divDOM.remove();
    }
  }

  renderProductCard(productData, buyProduct, openModalWindowAddInfo) {
    const arrOfData = [
      {
        id: productData.id,
        type: productData.type, 
        name: productData.name,
        quantity: productData.quantity > 0 ? productData.quantity : 'ended',
        price: productData.price,
        imgSrc: productData.url
      }];

    const eventObj = {
      name: `productCardId${productData.id}`,
      one: [{
        selector: `.card_${productData.id}_buy_btn`,
        eventName: 'click',
        funName: () => buyProduct()
      },
      {
        selector: `.product_add_info_card_${productData.id}`,
        eventName: 'click',
        funName: () => openModalWindowAddInfo()
      }],
      all: []}

    this.templater.initTemplate('productCardTemplate', arrOfData, this.domStorage.productListContainer.divDOM, eventObj, true);
    this.domStorage.productCard.divDOM = document.querySelector(`.card_${productData.id}_div`);
    this.domStorage.productCard.inputBuyDOM = document.querySelector(`.card_${productData.id}_quantity_to_buy`);
    this.domStorage.productCard.quantitySpanDOM = document.querySelector(`.card_${productData.id}_quantity`);
  }

  renderModalWindowAddInfo() {
    const arrOfData = [
      {

      }];
    const eventObj = {
      name: 'modalWindowProductCardInfo',
      one: [{
        selector: `.modal_window_product_card_close`,
        eventName: 'click',
        funName: () => this.removeModalWindowAddInfo()
      }],
      all: []}
    this.templater.initTemplate('productCardInfoModalTemplate', arrOfData, this.domStorage.modalWindowInfoContainer.divDOM, eventObj);
    this.domStorage.modalWindowInfo.divDOM = document.querySelector('.modal_window_product_card');
    this.domStorage.modalWindowInfo.sectionDOM = document.querySelector('.modal_window_product_card_content');
    this.domStorage.modalWindowInfo.divDOM.classList.add('is-active');
  }

  renderModalWindowAddInfoProperties(prodData) {
    Object.entries(prodData).forEach((property) => {
      if(property[0] === 'id' || property[0] === 'url'){
        return;
      }
      const arrOfData = [{
        key: property[0],
        value: property[1]
      }];
      
      this.templater.initTemplate('productCardPropertyTemplate', arrOfData, this.domStorage.modalWindowInfo.sectionDOM);
    })

  }

  removeModalWindowAddInfo() {
    this.domStorage.modalWindowInfo.divDOM.classList.remove('is-active');
    this.templater.resetContainer(this.domStorage.modalWindowInfoContainer.divDOM, 'modalWindowProductCardInfo');
  }

  getPurchasedQuantity() {
    return this.domStorage.productCard.inputBuyDOM.value;
  }

  updateFieldsOfProductCard(prodData) {
    this.domStorage.productCard.quantitySpanDOM.innerHTML = prodData.quantity;
  }
}

export { ProductCardView };