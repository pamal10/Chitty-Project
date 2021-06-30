var express = require('express');
const chitHelpers = require('../Helpers/chit-helpers');
const alert= require('alert')
var router = express.Router();
var Handlebars=require('handlebars')
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

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
  
 
 let clientId= clientDetails._id
 let instdetails= await chitHelpers.getCompleteDetails(clientId)
  
  res.render('user/userDetails',{clientDetails,instdetails,chitDetails})

}

  })
})

module.exports = router;
