var express = require("express");
var ejs = require("ejs");
require("dotenv").config;
const db = require("./db/db");
const randomstring = require("randomstring");

var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
// const sendEmail = require('../../utils/email');
const sendEmail = require("./public/utils/send_mail");
// const { generateToken, checkToken } = require("./jwt");

var mysql = require("mysql");
var session = require("express-session");
const { Console } = require("console");
const { json } = require("express/lib/response");
const { PassThrough } = require("stream");
const bcrypt = require("bcrypt");
const users = require("./public/js/data").userDB;
const verify_email = require("./public/template/vemail");

const mysqlStore = require("express-mysql-session")(session);
const PORT = 8081;
const IN_PROD = process.env.NODE_ENV === "production";
const TWO_HOURS = 1000 * 60 * 60 * 2;
const options = {
  connectionLimit: 10,
  password: "",
  user: "root",
  database: "node_project",
  host: "localhost",
  port: 3306,
  createDatabaseTable: false,
};
const pool = mysql.createPool(options);

const sessionStore = new mysqlStore(options);
// mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "project_laravel",
// });
const app = express();
// store: sessionStore,

app.use(
  session({
    name: "enter_the_session_name",
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    store: sessionStore,

    cookie: {
      maxAge: TWO_HOURS,
      httpOnly: true, //false access on client devtools document.cookie, xss scipt vulneable
    },
  })
);

// var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(PORT);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ resave: true, saveUninitialized: true, secret: "secret" }));

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

var sessionChecker = (req, res, next) => {
  console.log(`Session Checker: ${req.session.id}`.green);
  console.log(req.session);
  if (req.session.userId) {
    console.log(`Found User Session`.green);
    next();
  } else {
    console.log(`No User Session Found`.red);
    res.redirect("/");
  }
};
// localhost:8080
app.get("/", function (req, res) {
  const { userId } = req.session;
  console.log(req.session.id);
  //   res.send(`
  //   <h1> Welcome!</h1>
  //   ${
  //     userId
  //       ? `<a href = '/home'> Home </a>
  //   <form method='post' action='/logout'>
  //   <button>Logout</button>
  //   </form>`
  //       : `<a href = '/login'> Login </a>
  //   <a href = '/register'> Register </a>
  // `
  //   }
  //   `);
  // var con = mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   password: "",
  //   database: "node_project",
  // });
  req.session.reserve = false;
  // console.log(con);

  // pool.query("SELECT * FROM products", (err, result) => {
  //   req.session.inventory = result;
  //   console.log(req.session);

  res.render("pages/index", {
    reserved: "false",
    table_id: "",
  });
  //   });
});

app.post("/add_to_cart", sessionChecker, function (req, res) {
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

app.get("/cart", sessionChecker, function (req, res) {
  var cart = req.session.cart;
  var total = req.session.total;
  //req.session.total=calculateTotal(cart, req);;
  var count = req.session.cartitemsnum ? req.session.cartitemsnum : 0;
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

app.post("/edit_product_quantity", sessionChecker, function (req, res) {
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

app.get("/checkout", sessionChecker, function (req, res) {
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
            con.query(query, [values]);
          }

          res.redirect("/payment");
        });
      }
    });
  }
});

app.get("/payment", sessionChecker, function (req, res) {
  var total = req.session.total;
  var count = req.session.cartitemsnum;
  var cart = req.session.cart;
  //add local stoage if needed else find in session
  res.render("pages/payment", { total: total, count: count, cart: cart });
});

app.get("/verify_payment", sessionChecker, function (req, res) {
  var transaction_id = req.query.transaction_id;
  var order_id = req.session.order_id;
  var cart = req.session.cart;

  // var con = mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   password: "",
  //   database: "node_project",
  // });

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

app.get("/thank_you", sessionChecker, function (req, res) {
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

app.get("/single_product", sessionChecker, function (req, res) {
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

app.get("/partials/reset", function (req, res) {
  res.render("partials/reset");
});
///////popup login
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

app.get("/dashboard", sessionChecker, function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project",
  });
  console.log(req.session.id);
  console.log("sdsd");

  // req.session.reserve = false;
  con.query("SELECT * FROM products", (err, result) => {
    req.session.inventory = result;

    res.render("pages/dashboard", {
      result: result,
      reserved: "false",
      table_id: "",
      // msg:'null'
    });
  });
});
app.get("/login", function (req, res) {
  res.render("pages/index");
});
app.post("/login", async (req, res, next) => {
  try {
    const email = req.body.userlogin;
    let password = req.body.passwordlogin;
    console.log(email);
    let submittedPass = req.body.passwordlogin;
    console.log(JSON.stringify(req.body) + " " + "sdsd");
    console.log(bodyParser.text());
    submittedPass = submittedPass.toString().replace(/(^,)|(,$)/g, "");
    user = await db.getUserByEmail(email);
    console.log(user);
    if (!user) {
      // return res.send({
      //   message: "Invalid email",
      // });
      // res.redirect("/partials/modal");
      res.redirect("/login?error=" + encodeURIComponent("Invalid email"));
      return;
    }
    const passwordMatch = await bcrypt.compare(submittedPass, user.passwor);
    if (!passwordMatch) {
      res.redirect("/login?error=" + encodeURIComponent("Invalid password"));
      // res.render("pages/index", {
      //   e: "Invalid  password",
      // });
      // return res.send({
      //   message: "Invalid  password",
      // });
      return;
    }

    req.session.userId = user.id;
    req.session.purl = req.url;
    console.log(req.session.userId);
    res.redirect("../dashboard");
  } catch (e) {
    console.log(e);
    res.redirect("/login?error=" + encodeURIComponent("Incorrect_Credential"));
  }
});

app.get("/verify", async function (req, res) {
  const id = req.query.id;
  const token = req.query.token;
  // res.render("../");
  // console.log(typeof id);
  // console.log(typeof token);

  try {
    // const user = await User.findOne({ _id: req.params.id });
    i = Number(id);
    const user = await db.getUser(i);
    console.log(user);
    console.log(typeof user.token);

    console.log(token !== user.token);
    if (!user) return res.status(400).send("Invalid link");
    if (!(token == user.token)) return res.status(400).send("Invalid link");

    await pool.query(`UPDATE users SET token='' , active=1 where id=${id}`);
    // await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
});

app.post("/reset", async (req, res, next) => {
  const email = req.body.userlogin;
  // let password = req.body.passwordlogin;
  let id;
  // console.log(email);
  // console.log(password + "sdsd");
  try {
    // if (!email) {
    //   res.redirect("/?error=" + encodeURIComponent("Please enter email"));
    // }
    if (!email) {
      return res.sendStatus(400);
    }

    user = await db.getUserByEmail(email);

    if (user) {
      let token = randomstring.generate();
      let link = `http://localhost:8081/reset-passwo?id=${user.id}&token=${token}`;
      let content = `please click to reset <a href="${link}">account</a>`;

      // const html = verify_email(
      //   `http://localhost:8081/verify/${id}/${token}`
      // );
      console.log(content);

      pool.query(`DELETE FROM passwordreset where email="${email}"`);

      pool.query(
        `INSERT into passwordreset (email,token) VALUES("${email}","${token}")`
      );

      sendEmail(email, "reset Your password", content);

      res.redirect(
        "../?success=" +
          encodeURIComponent("An Email sent to reset please verify")
      );
    } else {
      res.redirect("/?error=" + encodeURIComponent("Invalid email"));
    }
  } catch {
    res.redirect("/?error=" + encodeURIComponent("se error email"));
  }
});
app.get("/reset-passwo", async (req, res, next) => {
  const token = req.query.token;
  const id = req.query.id;
  let i = Number(id);

  try {
    if (token == undefined) res.status(400).send("An error occured");

    pool.query(
      "SELECT * FROM passwordreset where token=?",
      token,
      async function (e, result, fields) {
        if (e) {
          console.log("e to try again in db quey tigge ");
        }
        if (result !== undefined && result.length > 0) {
          const user = await db.getUser(i); //Promise { <pending> } without const
          // const user= pool.query("SELECT * FROM passwordreset where id=?", id);
          console.log(user);

          if (user) {
            res.render("partials/reset", { email: user.email, msg: "" });
          }
        } else {
          res.status(404).send("token doent exist email");
        }
      }
    );
  } catch {
    console.error("seerver error");
  }
});

app.post("/reset-passwo", async (req, res, next) => {
  //   const id = req.body.id;
  //   const user = await db.getUser(id);
  // console.log(req.body.id)
  let email = req.body.userlogin;

  try {
    // res.render("/partials/reset");
    // req.body.userlogin = user.email; //req.body.email
    //     // const firstName = req.body.firstName;
    //     // const lastName = req.body.lastName;
    //     const email = req.body.userlogin;
    let password = req.body.passwordlogin;
    //     let id;
    //     // console.log(email);
    //     // console.log(password + "sdsd");

    //     if (!email || !password) {
    //       return res.sendStatus(400);
    //     }

    //     user = await db.getUserByEmail(email);
    //     if(user){
    console.log(req.body.userlogin);
    if (req.body.passwordlogin == req.body.passwordconfirm) {
      let hashPassword = await bcrypt.hash(req.body.passwordlogin, 10);
      // pool.query(
      //   `DELETE FROM passwordreset where email="${req.body.userlogin}"`
      // );
      console.log(hashPassword);
      pool.query(
        `UPDATE users SET passwor="${hashPassword}" where email="${email}"`,

        function (e, result, fields) {
          if (e) {
            console.log("e to try again in db quey tigge ");
          }
          if (result !== undefined) {
            res.render("partials/reset", {
              email: email,
              msg: "Password update success",
            });
          } else {
            res.render("partials/reset", {
              email: email,
              msg: "Password update failed",
            });
          }
        }
      );
      // res.redirect(
      //   "partials/reset?success=" +
      //     encodeURIComponent("Password update success")
      // );
    } else {
      // res.redirect(
      //   "/reset-passwo" + encodeURIComponent("sev dint respond try again")
      // );
      res.render("partials/reset", {
        email: email,
        msg: "password mismatch",
      });
      // req.body.userlogin = user.email;

      // res.render("partials/reset", { email: user.email });
    }
  } catch (e) {
    console.log(e);
    console.log("asas");

    // e = "ssddd";
    // res.redirect("/register");
    // res.render("partials/reset", {
    //   email: email,
    //   msg: "sev dint respond try again",
    // });
    // res.redirect(
    //   "partials/reset?error=" + encodeURIComponent("sev dint respond try again")
    // );

    // res.render("/register", { e: " Invalid email or password" });

    // res.sendStatus(400);
  }
});
//     }
//   }

// })
app.get("/register", function (req, res) {
  // console.log(JSON.stringify(err) + "sdsd");
  // Generate the token

  // res.status(201).json({
  //   message: "An Email sent to your account please verify",
  // });
  res.render("pages/index");
});
app.post("/register", async (req, res, next) => {
  try {
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;
    const email = req.body.userlogin;
    let password = req.body.passwordlogin;
    let id;
    // console.log(email);
    // console.log(password + "sdsd");

    if (!email || !password) {
      return res.sendStatus(400);
    }

    user = await db.getUserByEmail(email);

    console.log(user);
    if (!user) {
      if (req.body.passwordlogin == req.body.passwordconfirm) {
        let hashPassword = await bcrypt.hash(req.body.passwordlogin, 10);
        // const token = await generateToken(payload, {
        //   expiresIn: "0.5h",
        //   algorithm: "HS256",
        // });
        const token = randomstring.generate();
        const active = 0;
        const user = await db
          .insertUser(email, hashPassword, token, active)
          .then((insertId) => {
            id = insertId;
            return db.getUser(insertId);
          });
        // req.session.userId = user.id;
        console.log(typeof id);
        let link = `http://localhost:8081/verify?id=${id}&token=${token}`;
        let content = `please click to confirm <a href="${link}">account</a>`;

        // const html = verify_email(
        //   `http://localhost:8081/verify/${id}/${token}`
        // );
        console.log(content);

        sendEmail(email, "Verify Your Email", content);
        console.log("ftfg");

        res.redirect(
          "../register?success=" +
            encodeURIComponent("An Email sent to your account please verify")
        );
        // res.status(201).json({
        //   message: "An Email sent to your account please verify",
        // });
        // res.redirect("../verify?email=" + email);
      } else {
        res.redirect(
          "../register?error=" +
            encodeURIComponent("Password mismatch, try again")
        );
        // res.render("partials/modal", {
        //   e: "Password mismatch, try again",
        // });
      }
    } else {
      res.redirect(
        "../register?error=" +
          encodeURIComponent("Email already used,please login")
      );
      // res.render("partials/modal", {
      //   e: "Email already used,please login",
      // });

      // res.redirect("pages/login");
    }
  } catch (e) {
    // console.log(e + "sdsd");
    // e = "ssddd";
    // res.redirect("/register");
    res.redirect("../register?error=" + encodeURIComponent("sev dint respond"));

    // res.render("/register", { e: " Invalid email or password" });

    // res.sendStatus(400);
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).send("Unable to log out");
    }
    // sessionStore.close();

    res.clearCookie("enter_the_session_name");
    res.redirect("/");
  });
});
// var logout = function (req, res, next) {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(400).send("Unable to log out");
//       } else {
//         res.send("Logout successful");
//       }
//     });
//   } else {
//     res.end();
//   }
// };

app.post("/regisssdter", async (req, res) => {
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
          passwor: hashPassword,
          passwordlogin: req.body.passwordlogin,
        };
        users.push(newUser);
        console.log(req.session);
        console.log(req.session.id);

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
    // res.send("Internal server error");
    res.render("pages/login", { e: " Invalid email or password" });
  }

  // app.post('/register/success',function(req, res){
  //             res.send("<div>email used</div>")
});
// app.post("/login", async (req, res) => {
//   try {
//     console.log(users);
//     let submittedPass = req.body.passwordlogin;
//     submittedPass = submittedPass.toString().replace(/(^,)|(,$)/g, "");
//     console.log(
//       submittedPass + "saas" + req.body.passwordlogin + req.body.userlogin
//     );
//     let foundUser = users.find((data) => req.body.userlogin === data.email);
//     if (foundUser) {
//       console.log(foundUser + "weef");
//       let storedPass = foundUser.password;

//       const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
//       if (passwordMatch) {
//         let usrname = foundUser.username;
//         res.redirect("../dashboard");

//         // res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='partials/modal'>logout</a></div>`);
//       } else {
//         res.render("pages/login", { e: " Invalid email or password" });

//         //res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
//       }
//     } else {
//       // let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
//       // await bcrypt.compare(req.body.passwordlogin, fakePass);
//       res.render("pages/index", { e: "Signup to create a new account" });

//       // res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
//     }
//   } catch (e) {
//     res.send("Internal server error" + e);
//   }
// });
