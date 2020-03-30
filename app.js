// BUDGET CONTROLLER
const budgetController = (function() {


})();

  




  

// UI CONTROLLER
const UIController = (function() {

  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();











//GLOBAL APP CONTROLLER
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
    // Get the field input data
    let input = UICtrl.getinput();
    console.log(input);
    // Add the item to the budget controller

    // Add new item to the UI

    // Calculate the budget

    // Display the budget on the UI
    
  }

  // For calling the setupEventListeners() we have to create public initialization function. To be a public needs to return it as object.
  return {
    init: function() {
      console.log('started');
      setupEventListeners();
    }
  }

})(budgetController, UIController);