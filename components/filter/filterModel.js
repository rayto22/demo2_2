class FilterModel{
  constructor() {
    this.cancelButtonsArr = [];
  }

  initFilterStatus() {
    // localStorage.removeItem('filterStatus');
    const filterStatus = localStorage.getItem('filterStatus');
    if(Boolean(filterStatus) === false || filterStatus === 'undefined'){
      localStorage.setItem('filterStatus', JSON.stringify(
        {
          category: {
            type: 'category',
            status: 'cancel',
            funName: 'filterByCateg'
          },
          name: {
            type: 'name',
            status: 'cancel',
            funName: 'filterByName',
            lastValue: ''
          },
          price: {
            type: 'price',
            status: 'cancel',
            funName: 'filterByMinMax',
            min: 0,
            max: Infinity
          },
          quantity: {
            type: 'quantity',
            status: 'cancel',
            funName: 'filterByMinMax',
            min: 0,
            max: Infinity
          },
          firstAddFilter: {
            type: 'cancel',
            status: 'cancel',
            funName: 'filterByProp',
            value: []
          },
          secondAddFilter: {
            type: 'cancel',
            status: 'cancel',
            funName: 'filterByProp',
            value: []
          }
        }
      ));
    }
    this.filterStatus = JSON.parse(localStorage.getItem('filterStatus'));
  }

  getCategoriesList() {
    return new Set(JSON.parse(localStorage.getItem('productList')).map(prodObj => prodObj.type));
  }

  setFilterProperty(filterName, property, val) {
    this.filterStatus[filterName][property] = val;
  }

  getFilterProperty(filterName, property) {
    return this.filterStatus[filterName][property];
  }

  resetAddFilter() {
    this.filterStatus.firstAddFilter = {
      type: 'cancel',
      status: 'cancel',
      funName: 'filterByProp',
      value: []
    };
    this.filterStatus.secondAddFilter = {
      type: 'cancel',
      status: 'cancel',
      funName: 'filterByProp',
      value: []
    };
  }

  addValueToAddFilterProperty(filterName, property, val) {
    if(this.filterStatus[filterName][property].indexOf(val) === -1) {
      this.filterStatus[filterName][property].push(val);
    }
  }

  removeValueFromAddFilterProperty(filterName, property, val) {
    const ind = this.filterStatus[filterName][property].indexOf(val);
    if(ind !== -1) {
      this.filterStatus[filterName][property].splice(ind, 1);
    }
  }

  removeAllValuesFromAddFilterProperty(type) {
    if(this.filterStatus.firstAddFilter.type === type){
      this.filterStatus.firstAddFilter.value.length = 0;
      return 'firstAddFilter';
    } else if(this.filterStatus.secondAddFilter.type === type) {
      this.filterStatus.secondAddFilter.value.length = 0;
      return 'secondAddFilter';
    }
  }

  saveFilterStatus(){
    localStorage.setItem('filterStatus', JSON.stringify(this.filterStatus));
  }

  filterProductList(prodArr){
    this.cancelButtonsArr.length = 0;
    Object.values(this.filterStatus).forEach((filter) => {
      if(filter.status !== 'cancel'){
        prodArr = this[filter.funName](prodArr, filter);
        this.cancelButtonsArr.push(filter.type);
      }
      return false;
    });
    return prodArr;
  }

  filterByName(prodArr){
    return prodArr.filter((prodObj) => {
      return prodObj.name.toLowerCase().indexOf(this.filterStatus.name.lastValue) !== -1;
    })
  }

  filterByCateg(prodArr){
    const categName = this.filterStatus.category.status;
    return prodArr.filter((prodObj) => {
      return prodObj.type.toLowerCase() === categName;
    })
  }

  filterByMinMax(prodArr, filterData) {
    const filterType = filterData.type;
    return prodArr.filter((prodObj) => {
        return prodObj[filterType] >= filterData.min && prodObj[filterType] <= filterData.max;
    });
  }

  filterByProp(prodArr, filterData) {
    console.log(filterData);
    
    return prodArr.filter((prodObj) => {
      if(Array.isArray(prodObj[filterData.type]) === true){
        return filterData.value.some((filterValue) => {
          return prodObj[filterData.type].indexOf(filterValue) !== -1;
        })  
      } else {
        return filterData.value.some((filterValue) => {
          return prodObj[filterData.type] === filterValue;
        })  
      }
    });
  }

  getCancelButtonsArr() {
    return this.cancelButtonsArr;
  }

  getAddFilterValue(addFilterNumber) {
    return this.filterStatus[addFilterNumber].value;
  }

  getAllPropsForCateg(categName) {
    console.log(categName);
    switch (categName) {
      case 'cancel': {
        return 'cancel';
      }
      case 'cat': {
        const catList = JSON.parse(localStorage.getItem('productList')).filter((prodObj) => {
          return prodObj.type === categName;
        });
        
        const arrOfArrOfColors = catList.map(prodObj => {
          return prodObj.color;
        });

        return {
          color: [...(new Set([].concat(...arrOfArrOfColors)))],
          gender: ['male', 'female']
        };
      }

      case 'dog': {
        const dogsList = JSON.parse(localStorage.getItem('productList')).filter((prodObj) => {
          return prodObj.type === categName;
        });

        const furArr = dogsList.map(prodObj => {
            return prodObj.fur;
        });

        const specArr = dogsList.map(prodObj => {
          return prodObj.specialization;
        });

        return {
          fur: [...(new Set(furArr))],
          specialization: [...(new Set(specArr))]
        };
      }

      case 'bird': {
        const birdList = JSON.parse(localStorage.getItem('productList')).filter((prodObj) => {
          return prodObj.type === categName;
        });

        const arrOfArrOfFeatures = birdList.map(prodObj => {
          return prodObj.features;
        });

        const arrOfArrOfColors = birdList.map(prodObj => {
            return prodObj.color;
        });

        return {
          features: [...(new Set([].concat(...arrOfArrOfFeatures)))],
          color: [...(new Set([].concat(...arrOfArrOfColors)))]
        };
      }

      case 'fish': {
        const fishList = JSON.parse(localStorage.getItem('productList')).filter((prodObj) => {
          return prodObj.type === categName;
        });

        const arrOfArrOfZonality = fishList.map(prodObj => {
          return prodObj.zonality;
        });

        const arrOfArrOfFeatures = fishList.map(prodObj => {
          return prodObj.features;
        });

        console.log();
        return {
          zonality: [...(new Set([].concat(...arrOfArrOfZonality)))],
          features: [...(new Set([].concat(...arrOfArrOfFeatures)))]
        };
      }     
    }
  }
}

export { FilterModel };