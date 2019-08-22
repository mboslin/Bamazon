var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  itemsForSale();
});

function itemsForSale() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity>0",
    
    function(err, res) {
      if (err) throw err;
      console.table("ID \t Name \t Price \t Quantity\n");
      for (var i = 0; i < res.length; i++) {
        
        console.log(
          res[i].item_id +
            "\t" +
            res[i].product_name +
            "\t" +
            res[i].price +
            "\t" +
            res[i].stock_quantity +
            "\n"
        );
      }

      promptQuestions(res.length);

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
            isValue(purchaseItemId) ||
            isValue(answer.quantity)
          ) {
            console.log("Invalid Input");
            if (purchaseItemId > length + 1 || isValue(purchaseItemId)) {
              console.log("The item ID is not valid");
            }
            if (isValue(answer.quantity)) {
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
