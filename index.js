var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var session = require("express-session");
const { Console } = require("console");
const { json } = require("express/lib/response");
const { PassThrough } = require("stream");
const bcrypt = require("bcrypt");

const users = require("./public/js/data").userDB;

mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project_laravel",
});

var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(8081);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ resave: true, saveUninitialized: true, secret: "secret" }));

function isProductInCart(cart, id) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].quantity = parseInt(cart[i].quantity) + 1;
      return true;
    }
  }

  return false;
}

function calculateTotal(cart, req) {
  total = 0;
  count = 0;
  if (cart == null) return;
  for (let i = 0; i < cart.length; i++) {
    //if we're offering a discounted price
    if (cart[i].sale_price) {
      total = total + cart[i].sale_price * cart[i].quantity;
    } else {
      total = total + cart[i].price * cart[i].quantity;
    }

    count += parseInt(cart[i].quantity);
  }
  req.session.total = total;
  req.session.cartitemsnum = count;
  console.log(JSON.stringify(req.session) + "sdsd");
  console.log(req.session.total + "3ee2we");
  // return cart.length;
}
/////calculateTotal for 15% 20% discount
function calculateTotal_disc(result, req, discount) {
  var disc_items1 = [];
  var discount_calc;
  if (result == null) return;
  for (let i = 0; i < result.length; i++) {
    discount_calc = (result[i].price - result[i].sale_price) / result[i].price;

    //if we're offering a discounted price
    if (discount_calc * 100 >= discount) {
      disc_items1.push(result[i]);
      //console.log(disc_items1 + "sdsdsd");
    }
  }

  return disc_items1;
}
// localhost:8080
app.get("/", function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  // req.session.reserve = false;
  con.query("SELECT * FROM products", (err, result) => {
    req.session.inventory = result;

    res.render("pages/index", {
      result: result,
      reserved: req.session.reserve_status,
      id: req.session.table,
    });
  });
});

app.post("/add_to_cart", function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var sale_price = req.body.sale_price;
  var quantity = req.body.quantity;
  var image = req.body.image;
  var product = {
    id: id,
    name: name,
    price: price,
    sale_price: sale_price,
    quantity: quantity,
    image: image,
  };

  if (req.session.cart) {
    var cart = req.session.cart;

    if (!isProductInCart(cart, id)) {
      cart.push(product);
    }
  } else {
    req.session.cart = [product];
    var cart = req.session.cart;
  }

  //calculate total
  //var cartitems = calculateTotal(cart, req); ///change
  calculateTotal(cart, req);
  //return to cart page
  //console.log(req.session.cartitemsnum + "addcatsdsd");
  //console.log(req.session.total + "addcat3ee2we");

  res.redirect("/cart");
});

app.get("/cart", function (req, res) {
  var cart = req.session.cart;
  var total = req.session.total;
  //req.session.total=calculateTotal(cart, req);;
  var count = req.session.cartitemsnum;
  // var count = 0;
  //   if (!cart) {
  //     req.session.cart = [];
  //     count = 0;
  //   }
  /////change

  // for (let i = 0; i < cart.length; i++) {
  //   count += cart[i].quantity;
  // }
  //console.log(req.body.checkbox1);
  //console.log(req.session.cartitemsnum + "catsdsd");
  // console.log(req.session.total + "cat3ee2we");
  ///afte payment and thankyou gng to cat
  res.render("pages/cart", { cart: cart, total: total, count: count });
});

app.post("/remove_product", function (req, res) {
  var id = req.body.id;
  var cart = req.session.cart;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart.splice(cart.indexOf(i), 1);
    }
  }

  //re-calculate
  calculateTotal(cart, req);
  res.redirect("/cart");
});

app.post("/edit_product_quantity", function (req, res) {
  //get values from inputs
  var id = req.body.id;
  var quantity = req.body.quantity;
  var increase_btn = req.body.increase_product_quantity;
  var decrease_btn = req.body.decrease_product_quantity;

  var cart = req.session.cart;

  if (increase_btn) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id == id) {
        if (cart[i].quantity > 0) {
          cart[i].quantity = parseInt(cart[i].quantity) + 1;
        }
      }
    }
  }

  if (decrease_btn) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id == id) {
        if (cart[i].quantity > 1) {
          cart[i].quantity = parseInt(cart[i].quantity) - 1;
        }
      }
    }
  }

  //$('#cartitemnumber').text('count');
  calculateTotal(cart, req);
  res.redirect("/cart");
});

// app.get('/cart_quantity',function(req,res){
//    var cart = req.session.cart;
//       var count=0;
//       for(let i=0;i<cart.length;i++){  count+=cart[i].qunatity;}
//       return count;
// $('ssds').text=count;
// })

app.get("/checkout", function (req, res) {
  var total = req.session.total;
  var count = req.session.cartitemsnum;
  res.render("pages/checkout", { total: total, count: count });
});

app.post("/place_order", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var city = req.body.city;
  var address = req.body.address;

  var shipname;
  var shipemail;
  var shipphone;
  var shipaddress;
  var shipcity;

  var cost = req.session.total;
  var status = "not paid";
  var date = new Date();
  var products_ids = "";
  var id = Date.now();
  req.session.order_id = id;

  //=address;

  //console.log(req.body.checkbox1);
  if (!req.body.checkbox1) {
    shipname = req.body.shipname; //=name;
    shipemail = req.body.shipemail; //=email;
    shipphone = req.body.shipphone; //=phone;
    shipaddress = req.body.shipaddress; //=address;
    shipcity = req.body.shipcity;
  } else {
    shipname = name;
    shipemail = email;
    shipphone = phone;
    shipaddress = address;
    shipcity = city;
  }
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  /// cart item zero and when in checkout
  var cart = req.session.cart;
  if (!cart) {
    res.redirect("/cart");
  } else {
    for (let i = 0; i < cart.length; i++) {
      products_ids = products_ids + "," + cart[i].id;
    }

    con.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        var query =
          "INSERT INTO orders (id,cost,name,email,status,city,address,phone,date,products_ids,shipname,shipemail,shipphone,shipaddress,shipcity) VALUES ?";
        var values = [
          [
            id,
            cost,
            name,
            email,
            status,
            city,
            address,
            phone,
            date,
            products_ids,
            shipname,
            shipemail,
            shipphone,
            shipaddress,
            shipcity,
          ],
        ];

        con.query(query, [values], (err, result) => {
          for (let i = 0; i < cart.length; i++) {
            var query =
              "INSERT INTO order_items (order_id,product_id,product_name,product_price,product_image,product_quantity,order_date) VALUES ?";
            var values = [
              [
                id,
                cart[i].id,
                cart[i].name,
                cart[i].price,
                cart[i].image,
                cart[i].quantity,
                new Date(),
              ],
            ];
            con.query(query, [values], (err, result) => {});
          }

          res.redirect("/payment");
        });
      }
    });
  }
});

app.get("/payment", function (req, res) {
  var total = req.session.total;
  var count = req.session.cartitemsnum;
  var cart = req.session.cart;

  res.render("pages/payment", { total: total, count: count, cart: cart });
});

app.get("/verify_payment", function (req, res) {
  var transaction_id = req.query.transaction_id;
  var order_id = req.session.order_id;
  var cart = req.session.cart;

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });

  con.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      var query =
        "INSERT INTO payments (order_id,transaction_id,date) VALUES ?";
      var values = [[order_id, transaction_id, new Date()]];
      con.query(query, [values], (err, result) => {
        con.query(
          "UPDATE orders SET status='paid' WHERE id='" + order_id + "'",

          (err, result) => {
            console.log(req.session.cart + "  check");

            // req.session.cart = [];
            //   for (let i = 0; i < cart.length; i++) {
            //     cart.splice(cart.indexOf(i), 1);
            //   }
            console.log(req.session.cart + "  check");
            // req.session.total = null;
            // req.session.cartitemsnum = null;
          }
        );
        res.redirect("/thank_you");
      });
    }
  });
});

app.get("/thank_you", function (req, res) {
  var order_id = req.session.order_id;
  req.session.total = undefined;
  req.session.cartitemsnum = undefined;
  var cart = req.session.cart;
  //donot pay fo same cat items again as cat is empty
  for (let i = 0; i < cart.length; i++) {
    cart.splice(cart.indexOf(i), 1);
  }
  req.session.cart = null;
  //<% count=0; total=0;%>
  res.render("pages/thank_you", {
    order_id: order_id,
  });
});

app.get("/single_product", function (req, res) {
  var id = req.query.id;

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });

  con.query("SELECT * FROM products WHERE id='" + id + "'", (err, result) => {
    res.render("pages/single_product", { result: result });
  });
});

app.get("/products", function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  //var cart = req.session.cart;
  con.query("SELECT * FROM products", (err, result) => {
    res.render("pages/products", { result: result });
  });
  //calculateTotal(cart, req);
  //console.log(req.session.count);
});

app.get("/products-discount15", function (req, res) {
  var discount = 15;

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  var cart = req.session.cart;
  con.query(
    "SELECT * FROM products WHERE sale_price IS NOT NULL",
    (err, result) => {
      res.render("pages/products", {
        result: calculateTotal_disc(result, req, discount),
      });
    }
  );
  // calculateTotal(cart, req);
});

app.get("/products-discount20", function (req, res) {
  var discount = 20;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  var cart = req.session.cart;
  con.query(
    "SELECT * FROM products WHERE sale_price IS NOT NULL",
    (err, result) => {
      // console.log(JSON.stringify(result) + "TFJGJH");
      res.render("pages/products", {
        result: calculateTotal_disc(result, req, discount),
      });
    }
  );
  // calculateTotal(cart, req);
});
app.get("/about", function (req, res) {
  res.render("pages/about");
});
//////////

app.get("/partials/modal", function (req, res) {
  res.render("partials/modal");
});
////book a table fom
app.post("/reservation", function (req, res) {
  var reserved = true;
  if (!req.session.reserve_status) {
    req.session.reserve_status = reserved;
    // console.log(req.session.reserve_status + "  fefe");
  }
  //= req.session.reserve;
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var persons = req.body.persons;
  var id = Date.now();
  var result = req.session.inventory;
  var date = req.body.date;
  // req.session.table = id;
  //console.log(name + "" + email + "" + result + "\n" + JSON.stringify(result));
  var insert_result_id;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  // await a;

  // var a = () => {
  con.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      var query =
        "INSERT INTO reservation (name,email,date,phone,person, reserve_status) VALUES ?";
      var values = [[name, email, date, phone, persons, reserved]];
      con.query(query, [values], (err, result) => {
        if (err) console.log(err);
        else {
          console.log(JSON.stringify(result));
          // insert_result_id =result.insertId
          req.session.table = result.insertId;

          //res.render();
          res.redirect("/");

          // con.query("SELECT id from reservation", (err, result) => {});
        }
      });
      // console.log("\n etytuyiuo" + JSON.stringify(insert_result));

      //req.session.table = insert_result.insertId;
    }
  });

  // console.log(req.session.reserve_status + " " + reserved);
  // console.log(req.session.table);

  // res.render("pages/index", {
  //   result: result,
  //   id: req.session.table,
  //   reserved: req.session.reserve_status,
  // });
});

app.get("/dashboard", function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  // req.session.reserve = false;
  con.query("SELECT * FROM products", (err, result) => {
    req.session.inventory = result;

    res.render("pages/dashboard", {
      result: result,
      reserved: "false",
      id: req.session.table,
      // msg:'null'
    });
  });
});

app.post("/register", async (req, res) => {
  try {
    console.log("User list", users);
    console.log(req.body.userlogin + "aasa" + req.body.passwordlogin + "ssdsd");
    let foundUser = users.find((data) => req.body.userlogin === data.email);
    if (!foundUser) {
      let hashPassword = await bcrypt.hash(req.body.passwordlogin, 10);
      if (req.body.passwordlogin == req.body.passwordconfirm) {
        let newUser = {
          id: Date.now(),
          email: req.body.userlogin,
          password: hashPassword,
          passwordlogin: req.body.passwordlogin,
        };
        users.push(newUser);

        console.log("User list", users);
        //    res.send('<div>email used</div>');
        res.redirect("../dashboard");
      } else {
        res.render("pages/index", {
          e: "Password mismatch, try again",
        });
      }
    } else {
      res.render("pages/index", {
        e: "Email already used",
      });
      //        res.send(`
      // <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
      // <script>
      //     $("#showload").html("<div>email used </div>")
      // </script>
      // `)
      //res.json({msg:"email in use"})
      // res.redirect('/')
      // res.render('pages/index',  {msg:"email"}     )

      //   res.render('pages/index',
      // function(err,html){
      //    res.send(html)
      //       console.log(err);
      //   }
      //   else{
      //      // console.log(html);

      // })
    }
  } catch {
    res.send("Internal server error");
  }

  // app.post('/register/success',function(req, res){
  //             res.send("<div>email used</div>")
});
app.post("/login", async (req, res) => {
  try {
    console.log(users);
    let submittedPass = req.body.passwordlogin;
    submittedPass = submittedPass.toString().replace(/(^,)|(,$)/g, "");
    console.log(
      submittedPass + "saas" + req.body.passwordlogin + req.body.userlogin
    );
    let foundUser = users.find((data) => req.body.userlogin === data.email);
    if (foundUser) {
      console.log(foundUser + "weef");
      let storedPass = foundUser.password;

      const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
      if (passwordMatch) {
        let usrname = foundUser.username;
        res.redirect("../dashboard");

        // res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='partials/modal'>logout</a></div>`);
      } else {
        res.render("pages/index", { e: " Invalid email or password" });

        //res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
      }
    } else {
      // let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
      // await bcrypt.compare(req.body.passwordlogin, fakePass);
      res.render("pages/index", { e: "Signup to create a new account" });

      // res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
    }
  } catch (e) {
    res.send("Internal server error" + e);
  }
});
