const Notification = require("../app_models/Notification");
const referal = require("../app_models/referal");
const user = require("../app_models/user");

async function Notificayion(user_id, message) {
  let userDetails = await user.findOne({ user_id: user_id });
  let referedUserDetails=await referal.findOne({user_id:user_id})
  let prepareData = {
    user_id: user_id,
    user_name: userDetails.name,
    message: message,
    referedUserDetails:referedUserDetails.refered_user_id,
    created_on:new Date()
  };
  let data = new Notification(prepareData).save().then((result) => {
    console.log("notification added");
  });
}

module.exports = {
    Notification: Notificayion,
};
