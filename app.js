/* ====================
  BUDGET CONTROLLER 
==================== */
const budgetController = (function() {
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type) {
        let sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
            /* 0
                [200, 400, 100]
                sun = 0 + 200 
                sum = 200 + 400
                sum = 600 + 100 = 700 */
        });

        data.totals[type] = sum;
    };

    // Store data
    let data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0,
            percentage: -1
        }
    };

    return {
        // Create public method that allow other modules to add a new item into our data structure.
        // return object which contains all public methods.
        addItem: function(type, des, val) {
            let newItem, ID;

            // [1 2 3 4 5], next ID = 6(on position 5(array is zero-based)the last one is five minus one) ==> ID = last ID + 1
            //Create new ID
            if (data.allItems[type].length > 0) {
                //--> add if statement because the array is zero line 20
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // --> [type]= 'inc' or 'exp'
            }

            // Create new item based on 'exp' or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into data structure
            data.allItems[type].push(newItem);
            // Return new element
            return newItem;
        },

        deleteItem: function(type, id) {
            let ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // calculete total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // Calculete the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the persentage of income that we spent
            // Expenses = 100 and the income 300, spent 33.333% = 100/300 = 0.3333 * 100
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            let allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });

            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };
})();

/* ====================
  UI CONTROLLER 
==================== */
const UIController = (function() {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    let formatNumber = function(num, type) {
        let numSplit, int, dec;

        num = Math.abs(num);
        num  = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        // 2310.4567 -> 2,310.46
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3); 
            // input 2310, output 2,310
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    let nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            let html, newHtml;

            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html =
                    '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            // Clear input fields after clicked
            let fields, fieldsArr;

            fields = document.querySelectorAll(
                DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
            );

            fieldsArr = Array.prototype.slice.call(fields); // from NodeList to Array

            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, type);

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent =
                    obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            let now, year, month, months;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Algust', 'September', 'October', 'November', 'Dicember'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            let fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);  // this returns the node list

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: function() {
            // ==> return private DOMstrings to the public!
            return DOMstrings;
        }
    };
})();

/* ====================
  GLOBAL APP CONTROLLER 
==================== */
const controller = (function(budgetCtrl, UICtrl) {
    // function that store all event listeners
    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    let updateBudget = function() {
        // 1.Calculate the budget
        budgetCtrl.calculateBudget();
        // 2.Return the budget
        let budget = budgetCtrl.getBudget();
        // 3.Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function() {
        // 1.Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2.Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();
        // 3.Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    // function called when we add new item
    let ctrlAddItem = function() {
        let input, newItem;

        // 1.Get the field input data
        input = UICtrl.getinput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2.Add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);
            // 3.Add new item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4.Clear the fields
            UICtrl.clearFields();
            // 5.Calculate and update budget
            updateBudget();
            // 6.Calcuilate & update percentages
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        // For calling the setupEventListeners() we have to create public initialization function. To be a public needs to return it as object.
        init: function() {
            console.log('started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
