import { Templater } from '../templater/templater.js';

class BasketView{
  constructor() {
    this.templater = new Templater;

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

  hangEvents(saveBasketStatus) {
    window.addEventListener('unload', () => saveBasketStatus());
  }

  renderBasketModalWindow(renderBasketContent, renderPurchaseHistory, renderOrderForm) {
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
        funName: () => renderBasketContent()
      },
      {
        selector: '.tab_2_history',
        eventName: 'click',
        funName: () => renderPurchaseHistory()
      },
      {
        selector: '.tab_3_order',
        eventName: 'click',
        funName: () => renderOrderForm()
      }],
      all: []}
    this.templater.initTemplate('basketModalTemplate', templateArrOfData, this.domStorage.basketModalWindowDiv.divDOM, templateObjOfEvents);
    this.domStorage.basketModalWindow.divDOM = document.querySelector('.modal_window_basket');
    this.domStorage.basketModalWindow.contentDivDom = document.querySelector('.modal_window_basket_content');
    this.domStorage.basketModalWindow.tab1Content = document.querySelector('.tab_1_content');
    this.domStorage.basketModalWindow.tab2History = document.querySelector('.tab_2_history');
    this.domStorage.basketModalWindow.tab3Order = document.querySelector('.tab_3_order');
  }

  renderBasketButton(contentQuantity, contentTotalPrice, openBasketModalWindow) {
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
        funName: () => openBasketModalWindow()
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

  renderBasketContent(contentData, increasePurchaseQuantity, decreasePurchaseQuantity) {
    this.domStorage.basketModalWindow.tab1Content.classList.add('is-active');
    this.domStorage.basketModalWindow.tab2History.classList.remove('is-active');
    this.domStorage.basketModalWindow.tab3Order.classList.remove('is-active');
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
        name: 'modalWindowContent',
        one: [{
          selector: `.basket_content_add_prod_${product.id}`,
          eventName: 'click',
          funName: () => increasePurchaseQuantity(product.id)
        },
        {
          selector: `.basket_content_remove_prod_${product.id}`,
          eventName: 'click',
          funName: () => decreasePurchaseQuantity(product.id, 1)
        },
        {
          selector: `.basket_content_cancel_prod_${product.id}`,
          eventName: 'click',
          funName: () => decreasePurchaseQuantity(product.id, product.quantity)
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

  renderPurchaseHistory(historyData) {
    this.domStorage.basketModalWindow.tab1Content.classList.remove('is-active');
    this.domStorage.basketModalWindow.tab2History.classList.add('is-active');
    this.domStorage.basketModalWindow.tab3Order.classList.remove('is-active');

    historyData.forEach((product) => {

      const templateArrOfData = [{
        id: product.id,
        imgSrc: product.url,
        prodName: product.name,
        prodQuantity: product.quantity,
        prodPriceFor1: product.price,
        prodPriceForAll: product.price*product.quantity
      }];

      this.templater.initTemplate('basketModalHistoryTemplate', templateArrOfData, this.domStorage.basketModalWindow.contentDivDom);
    });
  }

  renderOrderForm(purchaseQuantity, checkout) {
    this.domStorage.basketModalWindow.tab1Content.classList.remove('is-active');
    this.domStorage.basketModalWindow.tab2History.classList.remove('is-active');
    this.domStorage.basketModalWindow.tab3Order.classList.add('is-active');

    const templateArrOfData = [{}];

    const templateObjOfEvents = {
      name: 'modalWindowOrderForm',
      one: [{
        selector: '.busket_order_form',
        eventName: 'submit',
        funName: (e) => checkout(e)
      }],
      all: []
    };

    this.templater.initTemplate('basketModalOrderFormTemplate', templateArrOfData, this.domStorage.basketModalWindow.contentDivDom, templateObjOfEvents);
    this.domStorage.order = {};
    this.domStorage.order.confirmButtonDOM = document.querySelector('.basket_order_form_button_make_an_order');
    this.domStorage.order.confirmButtonInfoPDOM = document.querySelector('.basket_order_button_info');
    this.domStorage.order.nameInputDOM = document.querySelector('.basket_order_form_input_name');
    this.domStorage.order.surnameInputDOM = document.querySelector('.basket_order_form_input_surname');
    this.domStorage.order.emailInputDOM = document.querySelector('.basket_order_form_input_email');
    this.domStorage.order.phoneInputDOM = document.querySelector('.basket_order_form_input_phone');
    this.domStorage.order.destinationInputDOM = document.querySelector('.basket_order_form_input_destination');
    this.domStorage.order.messageTextAreaDOM = document.querySelector('.basket_order_form_text_area_message');
    if(purchaseQuantity > 0) {
      this.domStorage.order.confirmButtonDOM.disabled = false;
    } else {
      this.domStorage.order.confirmButtonInfoPDOM.innerHTML = 'Your basket is empty.'
    }
  }

  getDataFromOrderFields() {
    return {
      name: this.domStorage.order.nameInputDOM.value,
      surname: this.domStorage.order.surnameInputDOM.value,
      email: this.domStorage.order.emailInputDOM.value,
      phone: this.domStorage.order.phoneInputDOM.value,
      destination: this.domStorage.order.destinationInputDOM.value,
      message: this.domStorage.order.messageTextAreaDOM.value
    }
  }

  renderSuccessOrderForm(customersData) {
    const templateArrOfData = [{
      name: customersData.name,
      surname: customersData.surname
    }];

    this.templater.initTemplate('basketModalOrderSuccessTemplate', templateArrOfData, this.domStorage.basketModalWindow.contentDivDom);
  }

  updateFieldsOfPurchase(prodData) {
    this.domStorage.purchaseFields[prodData.id].quantitySpanDOM.innerHTML = prodData.quantity;
    this.domStorage.purchaseFields[prodData.id].totalPriceSpanDOM.innerHTML = prodData.quantity * prodData.price;
  }
}

export { BasketView };