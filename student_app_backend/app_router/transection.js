const express = require("express");
const router = express.Router();
const user = require("../app_models/user");
const referalFunction = require("../common/referaladdmony");
// const referal = require("../app_models/referal");
const transection = require("../app_models/transection");
const wallet = require("../app_models/wallet");
const referals = require("../app_models/referal");
const numberFunction = require("../common/numberFunction");
const referralCodeGenerator = require("referral-code-generator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const saltRounds = 10;

router.post("/addmony", async (req, res) => {
  let body = req.body;
  if (body.user_id == "") {
    res.send({
      statuscode: 202,
      status: "user_id is required",
      //data: data,
    });
  }
  if (body.transection_from_userid == "") {
    res.send({
      statuscode: 202,
      status: "user_id is required",
      //data: data,
    });
  }
  var preparedata = {
    user_id: body.user_id,
    position: body.position,
    amount: body.amount,
    transection_from_userid: body.transection_from_userid,
    transection_from_roleid: body.transection_from_roleid,
    commission: false,
    transection_to_userid: body.transection_to_userid,
    transection_to_roleid: body.transection_to_roleid,
    transection_from_type: body.transection_from_type,
    transection_to_type: body.transection_to_type,
    reason: body.reason,
    status: "success",
  };
  if (body.position == "ADD") {
    var amount = body.amount;
    // referalFunction.referalAddMony(preparedata);
  } else if (body.position == "DETECT") {
    var amount = -body.amount;
  }
  wallet
    .updateOne({ user_id: body.user_id }, { $inc: { current_amount: amount } })
    .then(async (data) => {
      if (body.topup) {
        await wallet
          .findOneAndUpdate(
            { user_id: body.transection_from_userid },
            { $inc: { current_amount: -amount } },
            { new: true }
          )
          .then(async (data) => {
            console.log("sdjafhskdjf>>>", data);
            var preparedatadec = {
              user_id: body.user_id,
              position: "DEC",
              amount: body.amount,
              transection_from_userid: body.transection_from_userid,
              transection_to_userid: body.transection_to_userid,
              transection_from_type: body.transection_from_type,
              transection_to_type: body.transection_to_type,
              commission: false,
              reason: body.reason,
              status: "success",
            };
            let newtransection = new transection(preparedatadec);
            await newtransection.save();
          })
          .catch((err) => {
            console.log(">>>>>>err", err);
          });
      }
      let newtransection = new transection(preparedata);
      await newtransection.save();
      res.send({
        statuscode: 200,
        status: "Money Add successfully",
        //data: data,
      });
    });
});

router.get("/singleuser/:id", async (req, res) => {
  let user_id = req.params.id;
  console.log("user_id", user_id);
  if (user_id == "") {
    res.send({
      statuscode: 202,
      status: "user_id is required",
      //data: data,
    });
  }
  user
    .aggregate([
      {
        $match: { user_id: Number(user_id) },
      },
      {
        $lookup: {
          from: "transections",
          localField: "user_id",
          foreignField: "user_id",
          as: "transectionList",
        },
      },
    ])
    .then((data) => {
      console.log("transection data", data);
      res.send({
        statuscode: 200,
        status: "transection list genetated",
        data: data,
      });
    });
});

router.get("/alluser", async (req, res) => {
  // let user_id = req.params.id;
  let query = req.query;
  console.log("query", query);
  let searchFilter = {};
  let data = [];
  if (query.user_id !== "") {
    // data.user_id = { $in: query.user_id };
    // data["user_id"] = { $in: query.user_id };
    let num = numberFunction.justNumbers(query.user_id);
    console.log("num", num);
    let field = { user_id: Number(num) };
    data.push(field);
    searchFilter["user_id"] = parseInt(num);
  }
  if (
    query.phonenumber !== "" &&
    // query.phonenumber !== "0" &&
    query.phonenumber !== NaN
  ) {
    // let field = { phone: Number(query.phone) };
    // data.push(field);
    searchFilter["phone"] = Number(query.phonenumber);
  }
  if (
    query.role_type !== "" &&
    // query.role_type !== "0" &&
    query.role_type !== NaN
  ) {
    // let field = { role_id: Number(query.role_id) };
    // data.push(field);
    searchFilter["role_id"] = Number(query.role_type);
  }

  let searchFilters = {};
  searchFilters["$and"] = [searchFilter];
  console.log("serarchfilter", searchFilter);
  console.log("data", searchFilters);
  user
    .aggregate([
      {
        $match: searchFilters,
      },
      // {
      //   $lookup: {
      //     from: "transections",
      //     localField: "user_id",
      //     foreignField: "user_id",
      //     pipeline: [
      //       {
      //         $match: {
      //           $and: [
      //             {
      //               user_id: 1,
      //             },
      //             {
      //               user_id: 2,
      //             },
      //             {
      //               created_on: {
      //                 $lte: new Date("2022-08-11T06:25:18.118+00:00"),
      //                 $gte: new Date("2022-08-11T05:59:33.060+00:00"),
      //               },
      //             },
      //           ],
      //         },
      //       },
      //     ],
      //     as: "transectionList",
      //   },
      // },
      {
        $lookup: {
          from: "referals",
          localField: "user_id",
          foreignField: "user_id",
          as: "referalList",
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "user_id",
          foreignField: "user_id",
          as: "walletsList",
        },
      },
      // {
      //   $filter: {
      //     input: "$transectionList",
      //     as: "num",
      //     cond: {
      //       $and: [
      //         { $eq: ["$$num.user_id", 1] },
      //         { $gt: ["$$created_on", new Date()] },
      //         // { $lte: ["$$created_on", },
      //       ],
      //     },
      //   },
      // },
    ])
    .then((data) => {
      // console.log("transection data", data);
      res.send({
        statuscode: 200,
        status: "transection list genetated",
        data: data,
      });
    });
});

router.get("/singleuser", async (req, res) => {
  // let user_id = req.params.id;
  let query = req.query;
  if (query.id == "") {
    res.send({
      statuscode: 202,
      status: "user_id is required",
      //data: data,
    });
  }
  // console.log("query", query);
  // let searchFilter = {
  //   id: Number(query.id),
  // };
  // let data = [];
  // if (query.user_id !== "") {
  //   // data.user_id = { $in: query.user_id };
  //   // data["user_id"] = { $in: query.user_id };
  //   // let field = { user_id: Number(query.user_id) };
  //   // data.push(field);
  //   searchFilter["user_id"] = parseInt(query.user_id);
  // }
  // if (query.phonenumber !== "" && query.phonenumber !== "0") {
  //   // let field = { phone: Number(query.phone) };
  //   // data.push(field);
  //   searchFilter["phone"] = Number(query.phonenumber);
  // }
  // if (query.role_type !== "" && query.role_type !== "0") {
  //   // let field = { role_id: Number(query.role_id) };
  //   // data.push(field);
  //   searchFilter["role_id"] = Number(query.role_type);
  // }

  // let searchFilters = {};
  // searchFilters["$and"] = [searchFilter];
  // console.log("serarchfilter", searchFilter);
  // console.log("data", searchFilters);
  user
    .aggregate([
      {
        $match: { user_id: Number(query.id) },
      },

      {
        $lookup: {
          from: "referals",
          localField: "user_id",
          foreignField: "user_id",
          as: "referalList",
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "user_id",
          foreignField: "user_id",
          as: "walletsList",
        },
      },
      // {
      //   $filter: {
      //     input: "$transectionList",
      //     as: "num",
      //     cond: {
      //       $and: [
      //         { $eq: ["$$num.user_id", 1] },
      //         { $gt: ["$$created_on", new Date()] },
      //         // { $lte: ["$$created_on", },
      //       ],
      //     },
      //   },
      // },
    ])
    .then((data) => {
      // console.log("transection data", data);
      res.send({
        statuscode: 200,
        status: "transection list genetated",
        data: data,
      });
    });
});

router.get("/singleUserList", async (req, res) => {
  let query = req.query;
  console.log("req.query", Number(query.user_id));
  console.log("req.query", query);

  let filterdata = {};
  let created_on = {};
  if (query.user_id !== "") {
    filterdata["user_id"] = Number(query.user_id);
  }
  if (query.commission !== "") {
    filterdata["commission"] = query.commission;
  }
  if (query.graterthan !== "") {
    created_on["$lte"] = new Date(query.graterthan);
  }
  if (query.lessthan !== "") {
    created_on["$gte"] = new Date(query.lessthan);
  }
  let filterdateLength = Object.keys(created_on).length;
  if (filterdateLength > 0) {
    filterdata["created_on"] = created_on;
  }
  console.log("filterdata", filterdata);
  await transection
    .find(filterdata)
    .sort({ created_on: -1 })
    .then((data) => {
      res.send({
        statuscode: 200,
        status: "transection list genetated",
        data: data,
      });
    });
});

// broker refereduser transection list

router.get("/referal_user_trans_list/:id", async (req, res) => {
  let id = req.params.id;
  if (id == "") {
    res.send({
      statuscode: 202,
      status: "user_id is required",
      //data: data,
    });
  }
  // let user_id = req.params.id;
  let query = req.query;
  console.log("user_id >>>>>>>>>>>>", query);
  let searchFilter = {};
  let insertData = [];
  if (query.user_id !== "") {
    let num = numberFunction.justNumbers(query.user_id);
    insertData.push({ $eq: ["$user_id", Number(num)] });
    console.log("data", insertData);
  }
  if (query.phonenumber !== "") {
    insertData.push({ $eq: ["$phone", Number(query.phonenumber)] });
    console.log("data", insertData);
  }
  if (query.role_type !== "") {
    insertData.push({ $eq: ["$role_id", Number(query.role_type)] });
    console.log("data", insertData);
  }

  let searchFilters = {};
  searchFilters["$and"] = insertData;
  referals
    .aggregate([
      {
        $match: { refered_user_id: Number(id) },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "user_id",
          foreignField: "user_id",
          as: "walletlList",
        },
      },
      {
        $unwind: {
          path: "$walletlList",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "user_id",
          pipeline: [
            {
              $match: {
                $expr: searchFilters,
              },
            },
          ],
          as: "refereduserlist",
        },
      },
      {
        $unwind: {
          path: "$refereduserlist",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          created_on: "$refereduserlist.created_on",
          modified_on: "$refereduserlist.modified_on",
          name: "$refereduserlist.name",
          password: "$refereduserlist.password",
          phone: "$refereduserlist.phone",
          referalList: [
            {
              created_on: 1,
              referal_id: 1,
              refered_user_id: 1,
              user_id: 1,
            },
          ],
          referal_code: "$refereduserlist.referal_code",
          role_id: "$refereduserlist.role_id",
          status: "$refereduserlist.status",
          user_id: "$refereduserlist.user_id",
          walletsList: [
            {
              Referal_amount_paid: "$walletlList.Referal_amount_paid",
              created_on: "$walletlList.created_on",
              current_amount: "$walletlList.current_amount",
              user_id: "$walletlList.user_id",
              wallet_id: "$walletlList.wallet_id",
            },
          ],
          // walletsList: 1,
        },
      },
    ])
    .then((data) => {
      console.log("transection data", data.length);
      res.send({
        statuscode: 200,
        status: "transection list genetated",
        data: data,
      });
    });
});

router.get("/shared_user_list", async (req, res) => {
  let query = req.query;
  console.log("req.query", Number(query.user_id));
  console.log("req.query", query);
  let filterdata = {};
  let created_on = {};
  if (query.user_id !== "") {
    filterdata["transection_from_userid"] = query.user_id;
  }
  if (query.graterthan !== "") {
    created_on["$lte"] = new Date(query.graterthan);
  }
  if (query.lessthan !== "") {
    created_on["$gte"] = new Date(query.lessthan);
  }
  let filterdateLength = Object.keys(created_on).length;
  if (filterdateLength > 0) {
    filterdata["created_on"] = created_on;
  }
  console.log("filterdata", filterdata);
  await transection.find(filterdata).then((data) => {
    res.send({
      statuscode: 200,
      status: "transection list genetated",
      data: data,
    });
  });
});

module.exports = router;
