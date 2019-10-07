import { SortModel } from '../sort/sortModel.js';
import { SortView } from '../sort/sortView.js';


class SortController{
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.model = new SortModel(this);
    this.view = new SortView(this);
  }

  rebuildProductList() {
    this.eventManager.publish('request to rebuild product list');
  }
  
  initSortStatus() {
    this.model.initSortStatus();
    this.view.renderSortButtons();
  }

  renderSortButtons() {
    this.view.renderSortButtons();
  }

  initSort(sortType){
    this.model.setSortStatus(sortType);
    this.rebuildProductList();
  }

  sortProductList(prodArr) {
    return this.model.sortProductList(prodArr);
  }

  setOrderIconToButton(sortStatus) {
    this.view.setOrderIconToButton(sortStatus);
  }

  unsetOrderIconToButton(sortType) {
    this.view.unsetOrderIconToButton(sortType);
  }

  saveSortStatus(){
    this.model.saveSortStatus();
  }
}

export { SortController }