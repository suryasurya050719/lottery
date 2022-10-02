const express = require("express");
const router = express.Router();
const user = require("../app_models/user");
const referal = require("../app_models/referal");
const wallet = require("../app_models/wallet");
const referralCodeGenerator = require("referral-code-generator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const saltRounds = 10;

router.post("/registor", async (req, res) => {
  let body = req.body;
  let referal_user_data = {};
  user
    .findOne({ phone: body.phone })
    .then(async (data) => {
      console.log("data", data);
      console.log("data", data.length);
      // if (data.length === 0) {
      if (body.referal_code && body.referal_code !== "") {
        await user
          .findOne({ referal_code: body.referal_code })
          .then((data) => {
            referal_user_data = data;
          })
          .catch((err) => {
            return res.status(201).json({ success: false, message: err });
          });
        if (referal_user_data == null && referal_user_data == "") {
          return res.json({
            statuscode: 201,
            status: "you are referal code is incorrect",
            //data: data,
          });
        }
      }
      if (data.otp == body.otp) {
        let referalcode = referralCodeGenerator.alphaNumeric("uppercase", 4, 2);
        var hash = await bcrypt.hash(req.body.password, saltRounds);
        let preparedata = {
          password: hash,
          referal_code: referalcode,
          modified_on: new Date(),
          isOtpVerify: true,
        };
        user
          .findOneAndUpdate({ phone: body.phone }, preparedata, {
            new: true,
          })

          .then((data01) => {
            let walletdata = {
              user_id: data01.user_id,
              current_amount: 0,
            };
            let newWallet = new wallet(walletdata);
            newWallet.save();
            res.send({
              statuscode: 200,
              status: "User Add successfully",
              //data: data,
            });
            if (body.referal_code !== "") {
              let referaldata = {
                user_id: Number(data01.user_id),
                refered_user_id: referal_user_data.user_id,
                refered_role_id: referal_user_data.role_id,
              };
              let newreferal = new referal(referaldata);
              newreferal.save();
            }
          });
      } else {
        res.json({
          success: false,
          statuscode: 400,
          status: "invalid otp",
        });
      }
      // } else {
      //   console.log("dfsdf");
      //   res.json({
      //     success: false,
      //     statuscode: 400,
      //     status: "Phone number is already registered with us",
      //   });
      // }
    })
    .catch((err) => {
      console.log("Errrrrr", err);
    });
});

router.post("/login", async (req, res) => {
  let body = req.body;
  console.log("data", body);
  user
    .findOne({ phone: body.phone })
    .then((data) => {
      console.log("data", data);
      bcrypt.compare(body.password, data.password).then((isMatch) => {
        if (isMatch) {
          var preparedata = {
            name: data.name,
            phone: data.phone,
            role_id: data.role_id,
            status: data.status,
            referal_code: data.referal_code,
            user_id: data.user_id,
          };
          jwt.sign(
            preparedata,
            "Lottry",
            { expiresIn: "24h" },
            (err, token) => {
              res.json({
                token: token,
                success: true,
                statuscode: 200,
                status: "Logged-in successfully",
                data: preparedata,
              });
            }
          );
        } else {
          res.json({
            success: false,
            statuscode: 400,
            status: "Password is incorrect",
          });
        }
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.send({
        statuscode: 201,
        status: "Accound Not found",
        data: err,
      });
    });
});

router.get("/singleuser/:id", async (req, res) => {
  let user_id = req.params.id;

  // user.findOne({ user_id: user_id }).then((data) => {
  //   res.send({
  //     statuscode: 200,
  //     status: "single user list sucessfully given",
  //     data: data,
  //   });
  // });
  user
    .aggregate([
      {
        $match: { user_id: Number(user_id) },
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
        $unwind: {
          path: "$referalList",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "wallets",
          localField: "user_id",
          foreignField: "user_id",
          as: "walletList",
        },
      },
      {
        $unwind: {
          path: "$walletList",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .then((data) => {
      res.send({
        statuscode: 200,
        status: "refered user list sucessfully given",
        data: data,
      });
    });
});

router.get("/refereduser/:id", async (req, res) => {
  let user_id = req.params.id;
  let query = req.query;
  console.log("user_id", user_id, query);
  let searchFilter = {};
  let insertData = [];
  if (query.user_id !== "") {
    insertData.push({ $eq: ["$user_id", Number(query.user_id)] });
    console.log("data", insertData);
  }
  if (query.phone !== "") {
    insertData.push({ $eq: ["$phone", Number(query.phone)] });
    console.log("data", insertData);
  }
  if (query.role_id !== "") {
    insertData.push({ $eq: ["$role_id", Number(query.role_id)] });
    console.log("data", insertData);
  }
  let searchFilters = {};
  searchFilters["$and"] = insertData;
  user
    .aggregate([
      {
        $match: { user_id: Number(user_id) },
      },
      {
        $lookup: {
          from: "referals",
          localField: "user_id",
          foreignField: "refered_user_id",
          as: "referalList",
        },
      },
      {
        $unwind: {
          path: "$referalList",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "referalList.user_id",
          foreignField: "user_id",
          pipeline: [
            {
              $match: {
                $expr: searchFilters,
              },
            },
          ],
          as: "referaluserlist",
        },
      },
      {
        $unwind: {
          path: "$referaluserlist",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          created_on: "$referaluserlist.created_on",
          modified_on: "$referaluserlist.modified_on",
          name: "$referaluserlist.name",
          password: "$referaluserlist.password",
          phone: "$referaluserlist.phone",
          referal_code: "$referaluserlist.referal_code",
          role_id: "$referaluserlist.role_id",
          status: "$referaluserlist.status",
          user_id: "$referaluserlist.user_id",
        },
      },
    ])
    .then((data) => {
      res.send({
        statuscode: 200,
        status: "refered user list sucessfully given",
        data: data,
      });
    });
});

router.get("/all", async (req, res) => {
  console.log("request query", req.query);
  let query = req.query;
  let data = {};
  if (query.user_id !== "") {
    data.user_id = query.user_id;
  } else if (query.phone !== "") {
    data.phone = query.phone;
  } else if (query.role_id !== "") {
    data.role_id = query.role_id;
  }
  user.find(data).then((data) => {
    res.json({
      statuscode: 200,
      status: true,
      data: data,
    });
  });
});

router.delete("/delete/:id", (req, res) => {
  let user_id = req.params.id;
  user.deleteOne({ user_id: user_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "user delete successfully",
      data: data,
    });
  });
});

router.put("/update", async (req, res) => {
  let body = req.body;
  console.log("body", body);
  let data = {
    user_id: body.uset_id,
    status: body.status == "A" ? "N" : "A",
  };
  console.log("bodatady", data);
  user
    .findOneAndUpdate(
      { user_id: data.user_id },
      { status: data.status },
      { new: true }
    )
    .then((data) => {
      console.log("data", data);
      res.send({
        statuscode: 200,
        status: "user updated successfully",
        data: data,
      });
    });
});

router.put("/userUpdate", async (req, res) => {
  let body = req.body;
  console.log("body", body);
  let data = {
    name: body.name,
    phone: body.phone,
  };
  console.log("bodatady", data);
  user
    .findOneAndUpdate({ user_id: body.user_id }, { $set: data }, { new: true })
    .then((data) => {
      console.log("data", data);
      res.send({
        statuscode: 200,
        status: "user updated successfully",
        data: data,
      });
    });
});

router.put("/forgotpassword", async (req, res) => {
  let crediential = req.body;
  console.log("body", crediential);
  user
    .findOne({ phone: crediential.phone })
    .then(async (data) => {
      console.log("data", data);
      if (data !== null) {
        if (data.otp == crediential.validOtp) {
          var hash = await bcrypt.hash(crediential.password, saltRounds);
          user
            .findOneAndUpdate(
              { phone: data.phone },
              { password: hash },
              { new: true }
            )
            .then((data) => {
              res.json({
                success: true,
                statuscode: 200,
                status: "password updated successfully",
              });
            });
        } else {
          res.json({
            success: false,
            statuscode: 400,
            status: "otp is not valid",
          });
        }
      } else {
        res.json({
          success: false,
          statuscode: 400,
          status: "Accoount not found ",
        });
      }
    })
    .catch((data) => {
      console.log("sdkjdk", data);
    });
});

// dashboard
router.get("/allbrokercustomercount", async (req, res) => {
  user
    .aggregate([
      {
        $facet: {
          broker: [
            { $match: { $and: [{ role_id: 2 }, { isOtpVerify: true }] } },
          ],
          customer: [
            { $match: { $and: [{ role_id: 3 }, { isOtpVerify: true }] } },
          ],
        },
      },
    ])
    .then((data) => {
      console.log("dtaa", data);
      res.json({
        success: false,
        data: data,
        statuscode: 400,
        status: "count generated",
      });
    });
});

module.exports = router;
