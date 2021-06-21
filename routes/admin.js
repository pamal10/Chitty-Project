var express = require('express');
const chitHelpers = require('../Helpers/chit-helpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  
  chitHelpers.getAllchits().then((details) => {
    console.log(details)
    if(details.length==0){
    res.send('hi')
  }else{
    res.render('admin/admin-home', { admin: true, details });
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

module.exports = router;
