var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('user/main');

});

router.post('/',(req,res)=>{
  chitHelpers.getUserDetails(req.body).then(()=>{

  })
})

module.exports = router;
