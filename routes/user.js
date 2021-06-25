var express = require('express');
const chitHelpers = require('../Helpers/chit-helpers');
const alert= require('alert')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  

  res.render('user/main');


});

router.post('/',(req,res)=>{
  chitHelpers.getUserDetails(req.body).then(async(clientDetails)=>{
   
    
if(clientDetails==null){

alert('             Invalid Input!        ')

  res.redirect('/')
}else{
  let chittyNo= req.body.ChittyNumber

  let chitDetails= await chitHelpers.getSingleChittyDetails(chittyNo)
  
 console.log('uff');
 let clientId= clientDetails._id
 let instdetails= await chitHelpers.getCompleteDetails(clientId)
  console.log('ond');
  res.render('user/userDetails',{clientDetails,instdetails,chitDetails})

}

  })
})

module.exports = router;
