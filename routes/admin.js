var express = require('express');
const chitHelpers = require('../Helpers/chit-helpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {

  chitHelpers.getAllchits().then((details) => {
    detailsLength = Object.keys(details).length

    if (detailsLength == 0) {
      res.send('hi')

    } else {
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
router.get('/EditChit/', (req, res) => {
  chitHelpers.getOneChittyDetails(req.query.id).then((details) => {
    res.render('admin/edit-chitForm', { admin: true, details })
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



    res.render('admin/viewClients', { admin: true, chittyNo, details })

  })
})
router.get('/addClient', (req, res) => {
  chittyNo = req.query.id
  res.render('admin/addClient', { admin: true, chittyNo })
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
    res.render('admin/editClient', { admin: true, details })
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
router.get('/viewClientDetails/', (req, res) => {
  chittyNo = req.query.id
  chitHelpers.getSingleChittyDetails(chittyNo).then((details) => {
    chitHelpers.getOneClientDetails(chittyNo).then((Details) => {
      res.render('admin/clientDetails', { admin: true, details, Details })

    })
  })

})
router.get('/addInstallment/', (req, res) => {
  clientId = req.query.id
  console.log('ivide ethi');
  console.log(clientId);
  chitHelpers.getChittyDetailsWithclientId(clientId).then((chitDetails) => {
    res.render('admin/addInstallment', {admin:true, clientId ,chitDetails})
  })
})
router.post('/addInstallment/', (req, res) => {
  clientId = req.query.id
  chitHelpers.addInstallment(clienttId, req.body).then(() => {
    res.redirect('/viewClientDetails?id=' + chittyNo)
  })
})
module.exports = router;
