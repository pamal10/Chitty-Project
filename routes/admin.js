var express = require('express');
const { getPaymentStatus } = require('../Helpers/chit-helpers');
const chitHelpers = require('../Helpers/chit-helpers');
var router = express.Router();
var Handlebars = require('handlebars')
const alert = require('alert')
Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});



/* GET users listing. */
router.get('/', function (req, res, next) {
  chitHelpers.ViewAdmin().then((details) => {
    if (details.length === 0) {
      res.redirect('/admin/createAccount')

    } else {
      if (req.session.admin) {
        chitHelpers.getAllchits().then((details) => {
          detailsLength = Object.keys(details).length

          //if (detailsLength == 0) {
          // res.send('hi')

          //   } else {
          res.render('admin/admin-home', { admin: true, adminlogged: true, details });

          //  }
        })
      } else {
        res.redirect('/admin/login')
      }



    }
  });
})

router.get('/AddnewChit', (req, res) => {
  if (req.session.admin) {
    res.render('admin/new-chitForm', { admin: true, adminlogged: true })
  } else {
    res.redirect('/admin/login')
  }
})
router.post('/AddnewChit', (req, res) => {
  console.log(req.body)
  chitHelpers.addNewchit(req.body).then(() => {
    res.redirect('/admin')
  })

})
router.get('/EditChit/', (req, res) => {
  chitHelpers.getOneChittyDetails(req.query.id).then((details) => {
    res.render('admin/edit-chitForm', { admin: true, details, adminlogged: true })
  })
})
router.post('/EditChit/', (req, res) => {
  chitHelpers.UpdateChittyDetails(req.query.id, req.body).then(() => {
    res.redirect('/admin')
  })
})
router.get('/DeleteChitty/', (req, res) => {
  chitHelpers.deleteChitty(req.query.id).then(() => {
    res.redirect('/admin')

  })
})
router.get('/viewClients/', (req, res) => {
  chittyNo = req.query.id
  chitHelpers.getClients(chittyNo).then((details) => {



    res.render('admin/viewClients', { admin: true, chittyNo, details, adminlogged: true })

  })
})
router.get('/addClient', (req, res) => {
  chittyNo = req.query.id
  chitHelpers.LastChittaalNumber(chittyNo).then((LastMan) => {
    if (typeof LastMan == "undefined") {
      res.render('admin/addClient', { admin: true, chittyNo, next: false, adminlogged: true })
    } else {
      let LastNumber = LastMan.chittaalNumber
      let nextMan = parseInt(LastNumber) + 1
      res.render('admin/addClient', { admin: true, chittyNo, next: true, nextMan, adminlogged: true })
    }
  })
})
router.post('/addClient/', (req, res) => {
  chittyNo = req.query.id
  chitHelpers.addClient(chittyNo, req.body).then(() => {
    res.redirect('/admin/viewClients?id=' + chittyNo)
  })
})
router.get('/EditClient/', (req, res) => {
  clientId = req.query.id
  chitHelpers.getClientDetails(clientId).then((details) => {
    res.render('admin/editClient', { admin: true, details, adminlogged: true })
  })
})
router.post('/EditClient/', (req, res) => {
  clientId = req.query.id
  chitHelpers.updateClient(clientId, req.body).then(() => {
    res.redirect('/admin/viewClients?id=' + chittyNo)
  })
})
router.get('/DeleteClient/', (req, res) => {
  clientId = req.query.id
  chitHelpers.removeClient(clientId).then(() => {
    res.redirect('/admin/viewClients?id=' + chittyNo)
  })
})
router.get('/viewClientDetails/', async (req, res) => {
  console.log('hi ' + req.query.id)
  clientId = req.query.id
  let detail = await chitHelpers.getCompleteDetails(clientId)
  console.log(clientId);
  let details = await chitHelpers.getClientDetails(clientId)
  let chittyNo = details.ChittyNumber
  console.log(chittyNo);
  let chitDetails = await chitHelpers.getSingleChittyDetails(chittyNo)
  console.log(chitDetails);
  let MonthlyInstallment = chitDetails.MonthlyInstallment
  let NumberOfMonths = chitDetails.NumberOfMonths
  let Sala = chitDetails.Sala

  console.log('hmm');



  res.render('admin/clientDetails', { admin: true, detail, details, adminlogged: true, MonthlyInstallment, NumberOfMonths, Sala })
  //}

})
router.get('/addInstallment/', (req, res) => {
  chittyNo = req.query.id
  console.log('ivide ethi');
  chitHelpers.getLastInstallment(chittyNo).then((lastInstall) => {




    let Month = new Date().toLocaleString('en-us', { month: 'long' });
    let Year = new Date().getFullYear()
    console.log(Month);
    // if (Object.keys(inst).length === 0 && inst.constructor === Object) {
    if (typeof lastInstall == "undefined") {
      console.log('hello');

      res.render('admin/addInstallment', { admin: true, chittyNo, Year, adminlogged: true, install: false, Month })
    } else {
      let inst = lastInstall.Installment
      let installment = parseInt(inst) + 1
      res.render('admin/addInstallment', { admin: true, chittyNo, adminlogged: true, installment, install: true, Year, Month })
    }
  })
})
router.post('/addInstallment/', (req, res) => {
  chittyNo = req.query.id
  chitHelpers.addInstallment(chittyNo, req.body).then(() => {
    res.redirect('/admin/viewClients?id=' + chittyNo)
  })
})
router.get('/editInstall/', (req, res) => {
  chittyNo = req.query.id
  console.log('ing poru');
  chitHelpers.getLastInstallment(chittyNo).then((lastInstall) => {
    res.render('admin/editInstallment', { admin: true, adminlogged: true, lastInstall })
  })
})
router.post('/editInstall/', (req, res) => {
  chittyNo = req.query.id
  console.log(req.body);
  chitHelpers.editInstallment(chittyNo, req.body).then(() => {
    res.redirect('/admin/viewClients?id=' + chittyNo)
  })
})
router.get('/changePaymentStatus/', (req, res) => {
  instId = req.query.id
  chitHelpers.changePaymentStatus(instId).then(() => {
    res.redirect('/admin/viewClientDetails?id=' + clientId)
  })
})
router.get('/changePayStatus/', (req, res) => {
  instId = req.query.id
  chitHelpers.changePayStatus(instId).then(() => {
    res.redirect('/admin/viewClientDetails?id=' + clientId)
  })
})
router.get('/changetoPriced', (req, res) => {
  clientId = req.query.id
  console.log(clientId);
  chitHelpers.changeToPriced(clientId).then(() => {
    res.redirect('/admin/viewClients?id=' + chittyNo)
  })
})
router.get('/changetononPriced', (req, res) => {
  clientId = req.query.id
  chitHelpers.changeToNonPriced(clientId).then(() => {
    res.redirect('/admin/viewClients?id=' + chittyNo)
  })
})



router.get('/login', (req, res) => {
  res.render('admin/loginForm', { admin: true })
})
router.post('/login', (req, res) => {
  chitHelpers.doLogin(req.body).then((response) => {
    if (response.status) {

      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin')
    } else {
      //req.session.adminLoginErr = true
      //res.redirect('/login')
      alert('No Match Found!')
      res.redirect('/admin/login')
    }
  })
})
router.get('/Logout', (req, res) => {
  req.session.admin = null
  req.session.adminLoggedin = false
  res.redirect('/admin/login')
})
router.get('/UpdatePasswordName', (req, res) => {
  res.render('admin/passwordUpdate', { admin: true })
})
router.post('/UpdatePasswordName', (req, res) => {
  if (req.body.NewPassword == req.body.ConfirmPassword) {
    chitHelpers.updatePassword(req.body).then((respons) => {
      if (respons.status) {
        alert('Password Changed Successfully')
        res.redirect('/admin')
      } else {
        alert('Invalid Username Or Old Password!')
        res.redirect('/admin/UpdatePasswordName')
      }
    })
  } else {
    alert('Password Mismatch!')
    res.redirect('/admin/UpdatePasswordName')
  }

})
router.get('/createAccount', (req, res) => {
  res.render('admin/accountCreate')
})
router.post('/createAccount', (req, res) => {
  chitHelpers.Addadmin(req.body).then(()=>{
    
    res.redirect('/admin/login')
  })
})


module.exports = router;
