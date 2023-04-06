const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongourl = "mongodb://127.0.0.1:27017/nodejs_LC";
const cors = require("cors");
const router = express.Router();

app.use(cors());

mongoose.connect(mongourl);

const connection = mongoose.connection;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

connection.on("open", () => {
  console.log("mongodp connected successfully");
});

const user = require("./app_router/user");
const transection = require("./app_router/transection");
const payment = require("./app_router/payment");
const sms = require("./app_router/sms");
const board = require("./app_router/board");
const share_account = require("./app_router/share_account");
const live_result = require("./app_router/live_result");
const add_ourinfo = require("./app_router/add_ourinfo");
const ticket_price = require("./app_router/ticketprice");
const game = require("./app_router/game");
const account = require("./app_router/account");
const customer_info = require("./app_router/customer_care");
const Booking = require("./app_router/booking");
const my_request = require("./app_router/my_request");
const result = require("./app_router/lottery_result");
const dropdown = require("./app_router/dropdown");
const winning =require("./app_router/winning_report")
app.use(express.json());
app.use("/images", express.static("assets"));
app.use("/user", user);
app.use("/transection", transection);
app.use("/payment", payment);
app.use("/sms", sms);
app.use("/board", board);
app.use("/shareAccount", share_account);
app.use("/live_result", live_result);
app.use("/addourinfo", add_ourinfo);
app.use("/ticket_price", ticket_price);
app.use("/game", game);
app.use("/account", account);
app.use("/customer_info", customer_info);
app.use("/booking", Booking);
app.use("/myrequest", my_request);
app.use("/lotery", result);
app.use("/dropdown", dropdown);
app.use("/winning", winning);

app.listen(4001, () => {
  console.log("server connected in 4001");
});
