var express = require('express');
const chitHelpers = require('../Helpers/chit-helpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin-home',{admin:true});
});
router.get('/AddnewChit',(req,res)=>{
  res.render('admin/new-chitForm',{admin:true})
})
router.post('/AddnewChit',(req,res)=>{
  console.log(req.body)
  chitHelpers.addNewchit(req.body).then(()=>{
    res.redirect('/')
  })
 
})
module.exports = router;
