const transection = require("../app_models/transection");
const wallet = require("../app_models/wallet");
const user = require("../app_models/user");
const { Notification } = require("../common/Notification");
const { model } = require("mongoose");

function referalAddMony(formdata) {
  let preparedata = formdata;
  console.log("preparedata", preparedata);
  // console.log("dfgdfgh from data", preparedata);
  var user_id = preparedata.user_id;
  user
    .aggregate([
      {
        $match: { user_id: user_id },
      },
      {
        $lookup: {
          from: "referals",
          localField: "user_id",
          foreignField: "user_id",
          as: "userlist",
        },
      },
      {
        $unwind: {
          path: "$userlist",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .then((data) => {
      // console.log("referal data", data);
      if (
        data[0].userlist.refered_user_id &&
        data[0].userlist.refered_user_id !== ""
      ) {
        let referal_user_id = data[0].userlist.refered_user_id;
        // console.log("uderid", referal_user_id);
        let incAmouont = 100;
        var transectiondata = {
          user_id: referal_user_id,
          position: "INC",
          amount: incAmouont,
          transection_from_userid: user_id,
          commission:true,
          transection_to_userid: referal_user_id,
          transection_from_type: "Gpay",
          transection_to_type: "Wallet",
          status: "success",
        };
        let walletdata = {
          $inc: { current_amount: incAmouont },
        };
        wallet
          .findOneAndUpdate({ user_id: referal_user_id }, walletdata)
          .then(async (walletdata) => {
            Notification(
              referal_user_id,
              `Successfully Referral Amount ${incAmouont} Added in Wallet`
            );
            await wallet
              .findOneAndUpdate(
                { user_id: preparedata.user_id },
                { Referal_amount_paid: true },
                { new: true }
              )
              .then((data) => {
                console.log("false data is woelon");
              });
            let newtransection = new transection(transectiondata);
            await newtransection.save();
          });
      }
    });
}

module.exports = {
  referalAddMony: referalAddMony,
};
