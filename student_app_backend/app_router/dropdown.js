const express =require("express")
const router=express.Router()
const config=require("../config/config")

router.get("/board",async(req,res)=>{
    let board=[
        {
            _id:1,
            board:config.one_digit
        },
         {
            _id:2,
            board:config.two_digit
        },
         {
            _id:3,
            board:config.three_half_digit
        },
         {
            _id:4,
            board:config.three_full_digit
        },
         {
            _id:5,
            board:config.four_digit
        },
         {
            _id:6,
            board:config.all_board_digit
        },
         {
            _id:7,
            board:config.box_digit
        }
    ]
     res.send({
      statuscode: 200,
      status: "list generated",
      data: board,
    });
})

router.get("/price",async(req,res)=>{
  let price=[
    {
        _id:1,
        price:config.first_price
    },
        {
        _id:2,
        price:config.second_price
    },
        {
        _id:3,
        price:config.third_price
    },
        {
        _id:4,
        price:config.fourth_price
    }
  ]

   res.send({
      statuscode: 200,
      status: "list generated",
      data: price,
    });
})

module.exports = router;