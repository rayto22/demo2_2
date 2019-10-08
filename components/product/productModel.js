class ProductModel{
  constructor() {
  }

  getProductList() {
    return fetch('/demo2_2/data/products.json').then(answ => answ.json())
      .then((d) => {
        d.forEach(prodObj => {
          prodObj.url = `/demo2_2/img/${prodObj.id}/prod.jpg`;
          if(prodObj.type === 'fish'){
            prodObj.features = [];
            if(prodObj.rapacity === true){
              prodObj.features.push('rapacity');
            }
            if(prodObj.freshwater === true){
              prodObj.features.push('freshwater');
            }
          }
          if(prodObj.type === 'bird'){
            prodObj.features = [];
            if(prodObj.flying === true){
              prodObj.features.push('flying');
            }
            if(prodObj.talking === true){
              prodObj.features.push('talking');
            }
            if(prodObj.singing === true){
              prodObj.features.push('singing');
            }
          }
        });
        const productList = JSON.parse(localStorage.getItem('productList'));
        if(Boolean(productList) === false || productList === 'undefined'){
          localStorage.setItem('productList', JSON.stringify(d));
          return d;
        } else {
          return productList;
        }
      });
  }

}

export { ProductModel };