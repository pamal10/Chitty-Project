var express = require('express');
const chitHelpers = require('../Helpers/chit-helpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  
 chitHelpers.getAllchits().then((details) => {
    detailsLength= Object.keys(details).length
   
    if(detailsLength==0){
     res.send('hi')
    
  }else{
    res.render('admin/admin-home', { admin: true ,details});
   
  }
 })

});
router.get('/AddnewChit', (req, res) => {
  
  res.render('admin/new-chitForm', { admin: true })
})
router.post('/AddnewChit', (req, res) => {
  console.log(req.body)
  chitHelpers.addNewchit(req.body).then(() => {
    res.redirect('/admin')
  })

})
router.get('/EditChit/',(req,res)=>{
  chitHelpers.getOneChittyDetails(req.query.id).then((details)=>{
    res.render('admin/edit-chitForm', {admin:true, details})
  })
})
router.post('/EditChit/',(req,res)=>{
  chitHelpers.UpdateChittyDetails(req.query.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})
router.get('/DeleteChitty/',(req,res)=>{
  chitHelpers.deleteChitty(req.query.id).then(()=>{
    res.redirect('/admin')
  
  })
})

module.exports = router;
