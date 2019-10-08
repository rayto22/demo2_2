import { Templater } from '../templater/templater.js';

class SortView{
  constructor() {
    this.templater = new Templater;

    this.domStorage = {
      sortBtnContainer: {
        divDOM : document.querySelector('.sort_buttons_div')
      },
      sortBtnColl: {}
    };

    this.templateArrOfData = [
      {
        sortType: 'name',
        btnName: 'A-Z'
      },
      {
        sortType: 'price',
        btnName: 'Price'
      },
      {
        sortType: 'quantity',
        btnName: 'Quantity'
      }
    ];


  }

  hangEvents(initSort, saveSortStatus) {
    this.templateObjOfEvents = {
      name: 'sort',
      one: [
        {
          selector: '.sortBtn[data-sort-name="name"]',
          eventName: 'click',
          funName: () => initSort('name')
        },
        {
          selector: '.sortBtn[data-sort-name="price"]',
          eventName: 'click',
          funName: () => initSort('price')
        },
        {
          selector: '.sortBtn[data-sort-name="quantity"]',
          eventName: 'click',
          funName: () => initSort('quantity')
        }
      ],
      all: []
    };

    window.addEventListener('unload', () => saveSortStatus());
  }

  unsetOrderIconToButton(sortType) {
      this.domStorage.sortBtnColl[sortType].querySelector('span').innerHTML = '';
  }

  setOrderIconToButton(sortStatus) {
    if(sortStatus.status !== 'cancel'){
      if(sortStatus.orderStrict === true){
        this.domStorage.sortBtnColl[sortStatus.status].querySelector('span').innerHTML = '<i class="fas fa-long-arrow-alt-down"></i>';
      } else {
        this.domStorage.sortBtnColl[sortStatus.status].querySelector('span').innerHTML = '<i class="fas fa-long-arrow-alt-up"></i>';
      }
    }
  }

  renderSortButtons() {
    this.templater.resetContainer(this.domStorage.sortBtnContainer.divDOM, 'sort');
    this.templater.initTemplate('sortBtnTemplate', this.templateArrOfData, this.domStorage.sortBtnContainer.divDOM, this.templateObjOfEvents);
    [...document.querySelectorAll('.sortBtn')].forEach((sortTypeBtnDOM) => {
      this.domStorage.sortBtnColl[sortTypeBtnDOM.getAttribute('data-sort-name')] = sortTypeBtnDOM;
    });
  }
}

export { SortView };