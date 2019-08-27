var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }

itemsForSale();
});

function itemsForSale() {
  connection.query("SELECT * FROM products",
    
    function(err, res) {
      if (err) throw err;
      console.table(res);
      

      promptQuestions(res);

    }
  );
}

function promptQuestions(length) {
  inquirer.prompt([
      {
        type: "input",
        name: "purchase_item_id",
        message:
          "Enter the product you would like to purchase? 'Press C to Exit'"
      }
    ])

    .then(function(answer) {
      var purchaseItemId = answer.purchase_item_id;
      if (purchaseItemId.toUpperCase() === "C") {
        process.exit();
      }

      inquirer
        .prompt([
          {
            type: "Input",
            name: "Quantity",
            message: "How many units would you like to purchase?"
          }
        ])

        .then(function(answer) {
          if (
            purchaseItemId > length + 1 ||
            isNaN(purchaseItemId) ||
            isNaN(answer.quantity)
          ) {
            console.log("Invalid Input");
            if (purchaseItemId > length + 1 || isNaN(purchaseItemId)) {
              console.log("The item ID is not valid");
            }
            if (isNaN(answer.quantity)) {
              console.log("Invalid Quantity. Please try again.");
            }

            // connection.end();
            itemsForSale();
          } else {
            connection.query(
              "SELECT stock_quantity, price FROM products WHERE item_id = ?",
              [purchaseItemId],
              function(err, res) {
                if (err) throw err;
                if (answer.quantity > res[0].stock_quantity) {
                  console.log("Insufficient Quantity! Try again");
                } else {
                  var updateQuantity =
                    res[0].stock_quantity - parseFloat(answer.quantity);
                  connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: updateQuantity
                      },
                      {
                        item_id: purchaseItemId
                      }
                    ],
                    function(err, res) {
                      if (err) throw err;
                    }
                  );
                  var totalCost = res[0].price * answer.quantity;
                  console.log(
                    "The total cost of the purchase : " + totalCost.toFixed(2)
                  );
                }
                
                // connection.end();
                itemsForSale();
              }
            );
          }
        });
    });
}
