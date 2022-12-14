const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const booking = require("../app_models/booking");

router.get("/preview", async (req, res) => {
  console.log("jdfsdjkf")
  let data_num = ["2", "4", "3"];
  let date = new Date();
  let show = "15:00";
  let gameName = "Dear";
  booking
    .aggregate([
      {
        $match: {
          // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
          $and: [{ game_name: "Dear" }, { showTime: "18:00" }],
        },
      },
      {
       $unwind:{
        path: "$booking_data",
        preserveNullAndEmptyArrays: true
      } 
      },
      {
        $group:{
          
            _id: "$_id",
            user_id:{$first:"$user_id"},
            game_id:{$first:"$game_id"},
            game_name:{$first:"$game_name"},
            phone:{$first:"$phone"},
            showTime:{$first:"$showTime"},
            booking_id:{$first:"$booking_id"},
            booking_data:{$push:"$booking_data"},
            ticket_price:{$first:"$booking_data.ticket_price"},
            totalTikect:{"$sum":"$booking_data.ticket_count"},
          total_price:{"$sum":"$booking_data.total_price"}
          }
        
      }
    ])
    .then(async(data) => {
      var total=[]
      var total_price=0
      var total_refered_comission=0
      await booking.aggregate([ {
        $match: {
          // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
          $and: [{ game_name: "Dear" }, { showTime: "18:00" }],
        },
      },
      {
       $unwind:{
        path: "$booking_data",
        preserveNullAndEmptyArrays: true
      } 
      }, {
        $group:{
          
            _id: "null",
            totalTikect:{"$sum":"$booking_data.ticket_count"},
          total_price:{"$sum":"$booking_data.total_price"}
          }
        
      }]).then(async(result)=>{
        // console.log("result for totalcount===>",result)
        total =result
      }).catch((error)=>{
        res.json({
          success: false,
          statuscode:202,
          status: error,
        });
      })
      await data.forEach((data1) => {
        let userprice=0;
        data1.booking_data.forEach((data2) => {
          // console.log("data2", data2);
          if (data2.board_name == "1 Digit Board") {
            let formation = data2.board_letter_formation;
            let board_leters = data2.board_letters;
            let show_result_number=data2.show_result_number
            console.log("formated data===>", formation,
            data_num,
            board_leters)
            let formation_data = Dateformation(
              formation,
              data_num,
              board_leters
            );
            console.log("formation_data", formation_data);
            for(i=0;i<formation_data.length;i++){
               if(show_result_number[i]==formation_data[i]){
                userprice = userprice+data2.first_price;
               }
            }
          } else if (data2.board_name == "2 Digit Board") {
            let formation = data2.board_letter_formation;
            let board_leters = data2.board_letters;
            let formation_data = Dateformation(
              formation,
              data_num,
              board_leters
            );
            console.log("formation_data 2", formation_data);
          } else if (data2.board_name == "3 Digit Board Half") {
          } else if (data2.board_name == "3 Digit Board Full") {
          } else if (data2.board_name == "box") {
          } else if (data2.board_name == "all board") {
          } else if (data2.board_name == "4 Digit Board Full") {
          }

        });
        data1['userprice']=userprice;
        total_price=total_price+userprice
        total_refered_comission=total_refered_comission+(userprice*5/100)
      });
      let results={}
      results["data"]=data
      results["overallTicket"]=total[0].totalTikect
      results["overallTicetprice"]=total[0].total_price
      results["overalluserprice"]=total_price
      results["total_refered_comission"]=total_refered_comission


      res.json({
        success: true,
      statuscode: 200,
      status: "preview create successfully",
      result:results
      })
    });
});

module.exports = router;

function Dateformation(con, assing, value) {
  let result = con.map((item) => {
    return item
      .split("")
      .map((element) => {
        return assing[value.indexOf(element)];
      })
      .join("");
  });
  return result;
}
