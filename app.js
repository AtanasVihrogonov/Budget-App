// BUDGET CONTROLLER
const budgetController = (function() {


})();

  






// UI CONTROLLER
const UIController = (function() {

  return {
    getInput: function() {
      let type = document.querySelector('.add__type').value;
      let description = document.querySelector('.add__description').value;
      let value = document.querySelector('.add__value').value;
  }

})();








//GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

  let ctrlAddItem = function() {
    // Get the field input data

    // Add the item to the budget controller

    // Add new item to the UI

    // Calculate the budget

    // Display the budget on the UI
    
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event) {
    if(event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);