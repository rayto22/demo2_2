import { Templater } from '../templater/templater.js';

class FilterView{
  constructor(contr) {
    this.controller = contr;
    this.templater = new Templater;

    this.cancelBtnObj = {
      category: {
        btnName: 'Category',
        className: 'nav_category_cancel',
        funName: 'initFilterByCateg'
      },
      name: {
        btnName: 'Search',
        className: 'search_cancel',
        funName: 'initFilterByName'
      },
      price: {
        btnName: 'Price',
        className: 'price_filter_cancel',
        funName: 'initFilterByPriceOrQuantity'
      },
      quantity: {
        btnName: 'Quantity',
        className: 'quantity_filter_cancel',
        funName: 'initFilterByPriceOrQuantity'
      },
      color: {
        btnName: 'Color',
        className: 'color_add_filter_cancel',
        funName: 'initAddFilterCheckBox'
      },
      gender: {
        btnName: 'Gender',
        className: 'gender_add_filter_cancel',
        funName: 'initAddFilterCheckBox'
      },
      fur: {
        btnName: 'Fur',
        className: 'fur_add_filter_cancel',
        funName: 'initAddFilterCheckBox'
      },
      specialization: {
        btnName: 'Specialization',
        className: 'specialization_add_filter_cancel',
        funName: 'initAddFilterCheckBox'
      },
      features: {
        btnName: 'features',
        className: 'features_add_filter_cancel',
        funName: 'initAddFilterCheckBox'
      },
      zonality: {
        btnName: 'zonality',
        className: 'zonality_add_filter_cancel',
        funName: 'initAddFilterCheckBox'
      }
    };

    this.domStorage = {
      name: {
        inputDOM: document.querySelector('.search_input')
      },
      category: {
        divDOM: document.querySelector('.categories_div')
      },
      mainFilter: {
        divDOM: document.querySelector('.main_filter')
      },
      additionalFilterDiv: {
        divDOM: document.querySelector('.additional_filter'),
      },
      additionalFilters: {},
      cancelFilter: {
        divDOM: document.querySelector('.cancel_buttuns_div')
      }
    };

    this.hangEvents();
  }

  hangEvents(){
    window.addEventListener('unload', () => this.controller.saveFilterStatus());
    this.domStorage.name.inputDOM.addEventListener('keyup', () => this.controller.initFilterByName());
  }

  clearCancelButtonsDiv() {
    this.templater.resetContainer(this.domStorage.cancelFilter.divDOM, 'cancelButtonFilter');
  }

  renderCancelButton(type) {
    const arrOfData = [
      {
        className: this.cancelBtnObj[type].className, 
        buttonName: this.cancelBtnObj[type].btnName
      }];

    const eventObj = {
      name: 'cancelButtonFilter',
      one: [{
        selector: `.${this.cancelBtnObj[type].className}`,
        eventName: 'click',
        funName: () => this.controller[this.cancelBtnObj[type].funName]('cancel', type)
      }],
      all: []}

    this.templater.initTemplate('cancelBtnTemplate', arrOfData, this.domStorage.cancelFilter.divDOM, eventObj, true);
  }

  renderCategories(categoriesList) {
    const arrOfData = [...categoriesList].map((categ) => {
      return {categName: categ, categContent: `${categ}s`};
    });

    const eventObj = {
      name: 'category',
      one: [...categoriesList].map((categ) => {
        return {
          selector: `.nav_category[data-categ-name='${categ}']`,
          eventName: 'click',
          funName: () => this.controller.initFilterByCateg(categ)
        }}),
      all: []
    };

    this.templater.initTemplate('categoryTemplate', arrOfData, this.domStorage.category.divDOM, eventObj);
  }

  renderMainFilter() {
    const templateArrOfData = [{
      filterHead: 'Filters',
      filterPriceHead: 'Price',
      filterQuantityHead: 'Quantity',
    }];

    const templateObjOfEvents = {
      name: 'mainFilter',
      one: [{
        selector: '.filter_price_min',
        eventName: 'keyup',
        funName: () => this.controller.initFilterByPriceOrQuantity(undefined, 'price')
      },
      {
        selector: '.filter_price_max',
        eventName: 'keyup',
        funName: () => this.controller.initFilterByPriceOrQuantity(undefined, 'price')
      },
      {
        selector: '.filter_quantity_min',
        eventName: 'keyup',
        funName: () => this.controller.initFilterByPriceOrQuantity(undefined, 'quantity')
      },
      {
        selector: '.filter_quantity_max',
        eventName: 'keyup',
        funName: () => this.controller.initFilterByPriceOrQuantity(undefined, 'quantity')
      },
    ],
    all: []
    };

    this.templater.resetContainer(this.domStorage.mainFilter.divDOM, 'mainFilterTemplate');
    this.templater.initTemplate('mainFilterTemplate', templateArrOfData, this.domStorage.mainFilter.divDOM, templateObjOfEvents);

    this.domStorage.price = {
      minInputDOM: document.querySelector('.filter_price_min'),
      maxInputDOM: document.querySelector('.filter_price_max')
    };
    this.domStorage.quantity = {
      minInputDOM: document.querySelector('.filter_quantity_min'),
      maxInputDOM: document.querySelector('.filter_quantity_max')
    };

  }

  renderAdditionalFilter(categName, propsObj) {
    this.templater.resetContainer(this.domStorage.additionalFilterDiv.divDOM, 'addFilter1');
    this.templater.resetContainer(this.domStorage.additionalFilterDiv.divDOM, 'addFilter2');
    switch (categName) {
      case 'cat': {

        const templateArrOfDataForBox = [{
          categName: categName,
          firstFilterName: 'Color',
          secondFilterName: 'Gender'
        }];
        this.templater.initTemplate('addFilterBox', templateArrOfDataForBox, this.domStorage.additionalFilterDiv.divDOM);

        const firstFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.firstAddFilter');
        propsObj.color.forEach(color => {
          const templateArrOfDataFirstFilter = [{
            filterName: 'color',
            type: color
          }];
          const templateObjOfEvents = {
            name: 'addFilter1',
            one: [{
              selector: `.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataFirstFilter[0].filterName, templateArrOfDataFirstFilter[0].type, 'firstAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataFirstFilter, firstFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`);
        });
        
        const secondFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.secondAddFilter');
        propsObj.gender.forEach(gender => {
          const templateArrOfDataSecondFilter = [{
            filterName: 'gender',
            type: gender
          }];
          const templateObjOfEvents = {
            name: 'addFilter2',
            one: [{
              selector: `.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataSecondFilter[0].filterName, templateArrOfDataSecondFilter[0].type, 'secondAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataSecondFilter, secondFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`)
        });
      
        break;
      }
      case 'dog': {
        
        const templateArrOfDataForBox = [{
          categName: categName,
          firstFilterName: 'Fur',
          secondFilterName: 'Specialization'
        }];
        this.templater.initTemplate('addFilterBox', templateArrOfDataForBox, this.domStorage.additionalFilterDiv.divDOM);

        const firstFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.firstAddFilter');
        propsObj.fur.forEach(furValue => {
          const templateArrOfDataFirstFilter = [{
            filterName: 'fur',
            type: furValue
          }];
          const templateObjOfEvents = {
            name: 'addFilter1',
            one: [{
              selector: `.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataFirstFilter[0].filterName, templateArrOfDataFirstFilter[0].type, 'firstAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataFirstFilter, firstFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`);
        });
        
        const secondFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.secondAddFilter');
        propsObj.specialization.forEach(specializationValue => {
          const templateArrOfDataSecondFilter = [{
            filterName: 'specialization',
            type: specializationValue
          }];
          const templateObjOfEvents = {
            name: 'addFilter2',
            one: [{
              selector: `.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataSecondFilter[0].filterName, templateArrOfDataSecondFilter[0].type, 'secondAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataSecondFilter, secondFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`)
        });

        break;
      }
      case 'bird': {
        
        const templateArrOfDataForBox = [{
          categName: categName,
          firstFilterName: 'Features',
          secondFilterName: 'Color'
        }];
        this.templater.initTemplate('addFilterBox', templateArrOfDataForBox, this.domStorage.additionalFilterDiv.divDOM);

        const firstFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.firstAddFilter');
        propsObj.features.forEach(feature => {
          const templateArrOfDataFirstFilter = [{
            filterName: 'features',
            type: feature
          }];
          const templateObjOfEvents = {
            name: 'addFilter1',
            one: [{
              selector: `.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataFirstFilter[0].filterName, templateArrOfDataFirstFilter[0].type, 'firstAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataFirstFilter, firstFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`);
        });
        
        const secondFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.secondAddFilter');
        propsObj.color.forEach(color => {
          const templateArrOfDataSecondFilter = [{
            filterName: 'color',
            type: color
          }];
          const templateObjOfEvents = {
            name: 'addFilter2',
            one: [{
              selector: `.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataSecondFilter[0].filterName, templateArrOfDataSecondFilter[0].type, 'secondAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataSecondFilter, secondFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`)
        });

        break;
      }
      case 'fish': {
        
        const templateArrOfDataForBox = [{
          categName: categName,
          firstFilterName: 'Zonality',
          secondFilterName: 'Features'
        }];
        this.templater.initTemplate('addFilterBox', templateArrOfDataForBox, this.domStorage.additionalFilterDiv.divDOM);

        const firstFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.firstAddFilter');
        propsObj.zonality.forEach(zonality => {
          const templateArrOfDataFirstFilter = [{
            filterName: 'zonality',
            type: zonality
          }];
          const templateObjOfEvents = {
            name: 'addFilter1',
            one: [{
              selector: `.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataFirstFilter[0].filterName, templateArrOfDataFirstFilter[0].type, 'firstAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataFirstFilter, firstFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataFirstFilter[0].filterName}${templateArrOfDataFirstFilter[0].type}`);
        });
        
        const secondFilterDivDOM = this.domStorage.additionalFilterDiv.divDOM.querySelector('.secondAddFilter');
        propsObj.features.forEach(feature => {
          const templateArrOfDataSecondFilter = [{
            filterName: 'features',
            type: feature
          }];
          const templateObjOfEvents = {
            name: 'addFilter2',
            one: [{
              selector: `.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`,
              eventName: 'click',
              funName: () => this.controller.initAddFilterCheckBox(undefined, templateArrOfDataSecondFilter[0].filterName, templateArrOfDataSecondFilter[0].type, 'secondAddFilter')
            }],
            all: []};
          this.templater.initTemplate('addFilterCheckBox', templateArrOfDataSecondFilter, secondFilterDivDOM, templateObjOfEvents, true);
          this.domStorage.additionalFilters[`${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`] = document.querySelector(`.addFilter${templateArrOfDataSecondFilter[0].filterName}${templateArrOfDataSecondFilter[0].type}`)
        });

        break;
      }     
    }
  }

  getSearchValue() {
    return this.domStorage.name.inputDOM.value;
  }

  getPriceOrQuantityMinMaxValue(type) {
    return {
      min: this.domStorage[type].minInputDOM.value,
      max: this.domStorage[type].maxInputDOM.value,
    }
  }

  getAddFilterCheckBoxStatus(type, value){
    return this.domStorage.additionalFilters[`${type}${value}`].checked;
  }

  setSearchValue(val) {
    this.domStorage.name.inputDOM.value = val;
  }

  setPriceOrQuantityValue(type, min, max){
    this.domStorage[type].minInputDOM.value = min;
    this.domStorage[type].maxInputDOM.value = max;
  }

  setCheckBoxState(type, value, state) {
    if(type !== 'cancel'){
      value.forEach((val) => {
        this.domStorage.additionalFilters[`${type}${val}`].checked = state;
      })
    }
  }

}

export { FilterView };