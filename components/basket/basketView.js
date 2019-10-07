import { Templater } from '../templater/templater.js';

class BasketView{
  constructor(contr) {
    this.controller = contr;
    this.templater = new Templater;

    window.addEventListener('unload', () => this.controller.saveBasketStatus());

    this.domStorage = {
      basketButtonDiv: {
        divDOM: document.querySelector('.basket_button_div')
      },
      basketModalWindowDiv: {
        divDOM: document.querySelector('.modal_window_basket_div')
      },
      basketButton: {},
      basketModalWindow: {}
    }

    this.tabsName = ['modalWindowContent', 'modalWindowHistory', 'modalWindowOrderForm'];
  }

  renderBasketModalWindow() {
    const templateArrOfData = [{}];
    const templateObjOfEvents = {
      name: 'modalWindowBasket',
      one: [{
        selector: '.modal_window_basket_close',
        eventName: 'click',
        funName: () => this.closeBasketModalWindow()
      },
      {
        selector: '.tab_1_content',
        eventName: 'click',
        funName: () => this.controller.renderBasketContent()
      },
      {
        selector: '.tab_2_history',
        eventName: 'click',
        funName: () => this.controller.renderPurchaseHistory()
      },
      {
        selector: '.tab_3_order',
        eventName: 'click',
        funName: () => this.controller.renderOrderForm()
      }],
      all: []}
    this.templater.initTemplate('basketModalTemplate', templateArrOfData, this.domStorage.basketModalWindowDiv.divDOM, templateObjOfEvents);
    this.domStorage.basketModalWindow.divDOM = document.querySelector('.modal_window_basket');
    this.domStorage.basketModalWindow.contentDivDom = document.querySelector('.modal_window_basket_content');
    this.domStorage.basketModalWindow.tab1Content = document.querySelector('.tab_1_content');
    this.domStorage.basketModalWindow.tab2History = document.querySelector('.tab_2_history');
    this.domStorage.basketModalWindow.tab3Order = document.querySelector('.tab_3_order');
  }

  renderBasketButton(contentQuantity, contentTotalPrice) {
    const templateArrOfData = [{
      basketButtonClass: 'basket_button',
      basketQuantity: String(contentQuantity),
      busketButtonTotalPrice: 'busket_button_total_price',
      buttonName: 'Your basket',
      totalPrice: String(contentTotalPrice)
    }];

    const templateObjOfEvents = {
      name: 'basketButton',
      one: [{
        selector: '.basket_button',
        eventName: 'click',
        funName: () => this.controller.openBasketModalWindow()
      }
    ],
    all: []
    };

    this.templater.initTemplate('basketBtnTemplate', templateArrOfData, this.domStorage.basketButtonDiv.divDOM, templateObjOfEvents);
    this.domStorage.basketButton.btnDOM = document.querySelector('.basket_button');
  }

  openBasketModalWindow() {
    this.domStorage.basketModalWindow.divDOM.classList.add('is-active');
  }

  closeBasketModalWindow() {
    this.domStorage.basketModalWindow.divDOM.classList.remove('is-active');
  }

  clearBasketModalWindow() {
    this.tabsName.forEach((tabName) => {
      this.templater.resetContainer(this.domStorage.basketModalWindow.contentDivDom, tabName);
    })
  }

  removeBasketButton() {
    this.templater.resetContainer(this.domStorage.basketButtonDiv.divDOM, 'basketButton');
  }

  renderBasketContent(contentData) {
    this.domStorage.purchaseFields = {};
    Object.values(contentData.products).forEach((product) => {
      const templateArrOfData = [{
        id: product.id,
        imgSrc: product.url,
        prodName: product.name,
        prodQuantity: product.quantity,
        prodPriceFor1: product.price,
        prodPriceForAll: product.price*product.quantity
      }];

      const templateObjOfEvents = {
        name: `basketContent${product.id}`,
        one: [{
          selector: `.basket_content_add_prod_${product.id}`,
          eventName: 'click',
          funName: () => this.controller.increasePurchaseQuantity(product.id)
        },
        {
          selector: `.basket_content_remove_prod_${product.id}`,
          eventName: 'click',
          funName: () => this.controller.decreasePurchaseQuantity(product.id, 1)
        },
        {
          selector: `.basket_content_cancel_prod_${product.id}`,
          eventName: 'click',
          funName: () => this.controller.decreasePurchaseQuantity(product.id, product.quantity)
        }
      ],
      all: []
      };

      this.templater.initTemplate('basketModalContentTemplate', templateArrOfData, this.domStorage.basketModalWindow.contentDivDom, templateObjOfEvents, true);
      this.domStorage.purchaseFields[product.id] = {};
      this.domStorage.purchaseFields[product.id].quantitySpanDOM = document.querySelector(`.basket_content_purchase_quantity_${product.id}`);
      this.domStorage.purchaseFields[product.id].totalPriceSpanDOM = document.querySelector(`.basket_content_purchase_totalPrice_${product.id}`);
    })
  }

  renderPurchaseHistory() {
    console.log('history');
  }

  renderOrderForm() {
    console.log('orderForm');
  }

  updateFieldsOfPurchase(prodData) {
    this.domStorage.purchaseFields[prodData.id].quantitySpanDOM.innerHTML = prodData.quantity;
    this.domStorage.purchaseFields[prodData.id].totalPriceSpanDOM.innerHTML = prodData.quantity * prodData.price;
  }
}

export { BasketView };