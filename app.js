// ========== BUDGET CONTROLLER ===========

const budgetController = (function() {

  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Store data
  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
  
  return {
    // Create public method that allow other modules to add a new item into our data structure.
    // return object which contains all public methods.
    addItem: function(type, des, val) {
      let newItem, ID;

      // [1 2 3 4 5], next ID = 6(on position 5(array is zero-based)the last one is five minus one) ==> ID = last ID + 1
      //Create new ID
      if (data.allItems[type].length > 0) { //--> add if statement because the array is zero line 20 
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;  // --> [type]= 'inc' or 'exp'
      }

      // Create new item based on 'exp' or 'inc' type
      if (type === 'exp') {
        newItem  = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it into data structure
      data.allItems[type].push(newItem);
      // Return new element
      return newItem;
    },

    testing: function() {
      console.log(data);
    }
  };

})();

  




  

/// ========== UI CONTROLLER ===========

const UIController = (function() {

  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
  };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function(obj, type) {
      let html, newHtml;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },
    getDOMstrings: function() { // ==> return private DOMstrings to the public!
      return DOMstrings;
    }
  };
})();











// ========= GLOBAL APP CONTROLLER =========

const controller = (function(budgetCtrl, UICtrl) {
  // function that store all event listeners
  let setupEventListeners = function() {
    let DOM = UICtrl.getDOMstrings();  

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // function called when we add new item
  let ctrlAddItem = function() {
    let input, newItem;
    // Get the field input data
    input = UICtrl.getinput();
    // Add the item to the budget controller
    newItem = budgetController.addItem(input.type, input.description, input.value);

    // Add new item to the UI
    UICtrl.addListItem(newItem, input.type);
    // Calculate the budget

    // Display the budget on the UI
    
  }
  
  return {
    // For calling the setupEventListeners() we have to create public initialization function. To be a public needs to return it as object.
    init: function() {
      console.log('started');
      setupEventListeners();
    }
  };

})(budgetController, UIController);
controller.init();