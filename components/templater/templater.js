class Templater{
  constructor(eventManager){
    if (!!Templater.instance) {
      return Templater.instance;
    }
    Templater.instance = this;
    this.eventManager = eventManager;

    this.eventsStorage = {};

    this.templatePathColl = {
      // Filter
      'cancelBtnTemplate': '/demo2_2/components/filter/cancelButtonTemplate.html',
      'categoryTemplate': '/demo2_2/components/filter/categoryTemplate.html',
      'mainFilterTemplate': '/demo2_2/components/filter/mainFilterTemplate.html',
      'addFilterBox': '/demo2_2/components/filter/addFilterBox.html',
      'addFilterCheckBox': '/demo2_2/components/filter/addFilterCheckBox.html',
      // Sort
      'sortBtnTemplate': '/demo2_2/components/sort/sortBtnTemplate.html',
      // Products
      'productCardTemplate': '/demo2_2/components/productCard/productCardTemplate.html',
      'productCardInfoModalTemplate': '/demo2_2/components/productCard/productCardInfoModalTemplate.html',
      // Basket
      'basketBtnTemplate': '/demo2_2/components/basket/basketBtnTemplate.html',
      'basketModalTemplate': '/demo2_2/components/basket/basketModalTemplate.html',
      'basketModalContentTemplate': '/demo2_2/components/basket/basketModalContentTemplate.html'
    };
    this.templatesQuantity = Object.keys(this.templatePathColl).length;
    this.templatesQuantityLoaded = 0;
    this.templateColl = {};

    this.eventManager.subscribe('One template was loaded', this.checkFullLoadStatus.bind(this));

    this.getAllTemplates();

    return this;
  }

  getAllTemplates() {
    Object.entries(this.templatePathColl).forEach((pathNameValueArr) => {
      fetch(pathNameValueArr[1], {cache: 'force-cache'}).then(l=>l.text())
      .then(d => {
        this.templateColl[pathNameValueArr[0]] = d;
        this.eventManager.publish('One template was loaded');
      })
    });
  }

  checkFullLoadStatus() {
    this.templatesQuantityLoaded += 1;
    if(this.templatesQuantityLoaded === this.templatesQuantity){
      this.eventManager.unsubscribe('One template was loaded', this.checkFullLoadStatus.bind(this));
      this.eventManager.publish('All templates was loaded');
    }
  }
  
  initTemplate(templName, arrOfData, dom, eventObj, containerFlag) {
    this.render(templName, arrOfData, dom, containerFlag);
    if(Boolean(eventObj) === true) {
      this.hangEvents(eventObj);
    }
  }

  resetContainer(dom, name) {
    if(Boolean(this.eventsStorage[name]) === true) {
      this.eventsStorage[name].forEach(el => {
        el.domEl.removeEventListener(el.eventName, el.funName);
      });
      delete this.eventsStorage[name];
    }
    if(dom !== false){
      dom.innerHTML = '';
    }
  }

  removeCardFromList(selector, name) {
    if(Boolean(this.eventsStorage[name]) === true) {
      this.eventsStorage[name].forEach(el => {
        el.domEl.removeEventListener(el.eventName, el.funName);
      });
      this.eventsStorage[name].length = 0;
    } 
    document.querySelector(selector);
  }

  render(templName, arrOfData, dom, containerFlag) {
    const template = this.templateColl[templName];

    const result = arrOfData.reduce((str, obj) => {
      return str + Object.entries(obj).reduce((domEl, keyValueArr) => {
        const re = new RegExp(`{{ ${keyValueArr[0]} }}`,"g");
        return domEl.replace(re, keyValueArr[1]);
      }, template);
    }, "");

    if(containerFlag === true){
      const container = document.createElement('span');
      container.innerHTML += result;
      dom.appendChild(container);
    } else {
      dom.innerHTML += result;
    }
  }

  hangEvents(eventObj) {

    const newEventArr = eventObj.one.map(ev => {
      ev.domEl = document.querySelector(ev.selector);
      ev.domEl.addEventListener(ev.eventName, ev.funName);
      return ev;
    });
    if(this.eventsStorage.hasOwnProperty(eventObj.name)){
      this.eventsStorage[eventObj.name] = this.eventsStorage[eventObj.name].concat(newEventArr);
    } else {
      this.eventsStorage[eventObj.name] = newEventArr;
    }
    
    eventObj.all.forEach(ev => {
      let coll = document.querySelector(ev.selector);
      [...coll].forEach(elDOM => {
        elDOM.addEventListener(ev.eventName, ev.funName);
        this.eventsStorage[eventObj.name].push({
          selector: ev.selector,
          eventName: ev.eventName,
          funName: ev.funName,
          domEl: elDOM
        });
      });
    });
  }
}

export { Templater };