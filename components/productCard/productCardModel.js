class ProductCardModel {
  constructor(prodData) {
    this.productData = prodData;
  }

  getProductData(propertyName) {
    if(arguments.length === 0){
      return this.productData;
    } else {
      return this.productData[propertyName];
    }
  }

  setProductDataProperty(property, value) {
    this.productData[property] = value;
  }

  saveNewDataToLocalStorage(property) {
    const allProds = JSON.parse(localStorage.getItem('productList'));
    allProds.some((prod) => {
      if(prod.id === this.productData.id) {
        prod[property] = this.productData[property];
        return true;
      }
      return false;
    });
    localStorage.setItem('productList', JSON.stringify(allProds));
  }

  checkPossibilityToSell(purchased,onSale) {
    if(!Number.isNaN()
      && Number.isInteger(purchased) 
      && purchased > 0
      && purchased <= onSale){
      return true;
    }
  }
}

export { ProductCardModel };