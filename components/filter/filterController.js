import { FilterModel } from '../filter/filterModel.js';
import { FilterView } from '../filter/filterView.js';


class FilterController{
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.model = new FilterModel();
    this.view = new FilterView(this);
  }

  rebuildProductList() {
    this.eventManager.publish('request to rebuild product list');
  }

  initFilterStatus() {
    this.model.initFilterStatus();
        
    this.renderCategories();
    this.renderMainFilter();
    
    const categName = this.model.getFilterProperty('category', 'status');
    this.renderAdditionalFilter(categName, this.model.getAllPropsForCateg(categName));

    this.view.setSearchValue(this.model.filterStatus.name.lastValue);
    this.view.setPriceOrQuantityValue('price', this.model.filterStatus.price.min, this.model.filterStatus.price.max);
    this.view.setPriceOrQuantityValue('quantity', this.model.filterStatus.quantity.min, this.model.filterStatus.quantity.max);

    const firstAddFilterType = this.model.getFilterProperty('firstAddFilter', 'type');
    const firstAddFilterValue = this.model.getFilterProperty('firstAddFilter', 'value');
    this.view.setCheckBoxState(firstAddFilterType, firstAddFilterValue, true);

    const secondAddFilterType = this.model.getFilterProperty('secondAddFilter', 'type');
    const secondAddFilterValue = this.model.getFilterProperty('secondAddFilter', 'value');
    this.view.setCheckBoxState(secondAddFilterType, secondAddFilterValue, true);
  }

  filterProductList(prodArr) {
    this.view.clearCancelButtonsDiv();
    const filteredProdArr = this.model.filterProductList(prodArr);
    const cancelButtons = this.model.getCancelButtonsArr();
    cancelButtons.forEach((buttonType) => {
      this.renderCancelButton(buttonType);
    });
    return filteredProdArr;
  }


  initFilterByName(arg) {
    const searchValue = this.getSearchValue();
    this.model.setFilterProperty('name', 'lastValue', searchValue);
    if(searchValue !== '' && arg !== 'cancel'){
      this.model.setFilterProperty('name', 'status', true);
    } else {
      this.view.setSearchValue('');
      this.model.setFilterProperty('name', 'status', 'cancel');
    }
    this.rebuildProductList();
  }

  initFilterByCateg(categName) {
    if(this.model.getFilterProperty('category', 'status') !== categName) {
      this.model.setFilterProperty('category', 'status', categName);
      const propsObj = this.model.getAllPropsForCateg(categName);
      this.model.resetAddFilter();
      this.renderAdditionalFilter(categName, propsObj);
      this.rebuildProductList();
    }
  }

  initFilterByPriceOrQuantity(arg, type) {
    if(arg === 'cancel'){
      this.model.setFilterProperty(type, 'status', 'cancel');
      this.view.setPriceOrQuantityValue(type, '0', '');
      this.model.setFilterProperty(type, 'min', 0);
      this.model.setFilterProperty(type, 'max', Infinity);
    } else {
      this.model.setFilterProperty(type, 'status', true);
      const minMaxValue = this.view.getPriceOrQuantityMinMaxValue(type);
      this.model.setFilterProperty(type, 'min', Number(minMaxValue.min.replace(/\D/g, '')) || 0);
      this.model.setFilterProperty(type, 'max', Number(minMaxValue.max.replace(/\D/g, '')) || Infinity);
    }
    this.rebuildProductList();
  }

  initAddFilterCheckBox(arg, type, value, addFilterNumber) {
    if(arg === 'cancel') {

      const firstAddFilterType = this.model.getFilterProperty('firstAddFilter', 'type');
      const firstAddFilterValue = this.model.getFilterProperty('firstAddFilter', 'value');
      this.view.setCheckBoxState(firstAddFilterType, firstAddFilterValue, false);
  
      const secondAddFilterType = this.model.getFilterProperty('secondAddFilter', 'type');
      const secondAddFilterValue = this.model.getFilterProperty('secondAddFilter', 'value');
      this.view.setCheckBoxState(secondAddFilterType, secondAddFilterValue, false);

      addFilterNumber = this.model.removeAllValuesFromAddFilterProperty(type);
      this.model.setFilterProperty(addFilterNumber, 'status', 'cancel');
    } else {
      const checkBoxStatus = this.view.getAddFilterCheckBoxStatus(type, value);
      if(checkBoxStatus === true) {
        this.model.setFilterProperty(addFilterNumber, 'status', true);
        this.model.setFilterProperty(addFilterNumber, 'type', type);
        this.model.addValueToAddFilterProperty(addFilterNumber, 'value', value);
      } else {
        this.model.removeValueFromAddFilterProperty(addFilterNumber, 'value', value);
        if(this.model.getAddFilterValue(addFilterNumber).length === 0) {
          this.model.setFilterProperty(addFilterNumber, 'status', 'cancel');
        }
      }
    }
    this.rebuildProductList();
  }

  saveFilterStatus() {
    this.model.saveFilterStatus();
  }

  getSearchValue() {
    return this.view.getSearchValue();
  }

  setSearchValue(value) {
    this.view.setSearchValue(value);
  }

  clearCancelButtonsDiv() {
    this.view.clearCancelButtonsDiv();
  }

  renderCancelButton(type) {
    this.view.renderCancelButton(type);
  }

  renderCategories() {
    this.view.renderCategories(this.model.getCategoriesList());
  }

  renderMainFilter() {
    this.view.renderMainFilter();
  }

  renderAdditionalFilter(categName, propsObj) {
    this.view.renderAdditionalFilter(categName, propsObj);
  }

}

export { FilterController }