import { SortModel } from '../sort/sortModel.js';
import { SortView } from '../sort/sortView.js';


class SortController{
  constructor(eventManager) {
    this.eventManager = eventManager;
    this.model = new SortModel();
    this.view = new SortView();

    this.hangEvents();
  }

  hangEvents() {
    this.view.hangEvents(this.initSort.bind(this), this.saveSortStatus.bind(this));
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
    const sortStatus = this.model.getSortStatus();
    if(sortStatus.status !== 'cancel'){
      this.unsetOrderIconToButton(sortStatus.status);
    }
    this.model.setSortStatus(sortType);
    this.rebuildProductList();
  }

  sortProductList(prodArr) {
    const sortStatus = this.model.getSortStatus();
    this.setOrderIconToButton(sortStatus);
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