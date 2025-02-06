const express=require('express')
const router =express.Router();
const egg=require('../models/EggVariant')

router.get("/geteggs",async(req,res)=>{
    try {
        const eggs=await egg.find({})
        res.send(eggs)
    } catch (error) {
        return res.status(400).json({message:error})
    }
})

module.exports=router;