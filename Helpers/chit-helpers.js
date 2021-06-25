var db = require('../config/connection')
var collection = require('../config/collections')
var Promise = require('promise')
var objectId = require('mongodb').ObjectID
const { LengthRequired } = require('http-errors')

module.exports = {
    addNewchit: (data) => {
        return new Promise((resolve, reject) => {

            let sala = parseInt(data.MonthlyInstallment) * parseInt(data.NumberOfMonths)
            data.Sala = sala
            console.log(data);
            db.get().collection(collection.CHIT_COLLECTION).insertOne(data).then(() => {
                resolve()
            })
        })
    },
    getAllchits: () => {

        return new Promise(async (resolve, reject) => {

            console.log('call');
            let details = await db.get().collection(collection.CHIT_COLLECTION).find().toArray()

            resolve(details)

        })


    },
    getOneChittyDetails: (id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CHIT_COLLECTION).findOne({ _id: objectId(id) }).then((detail) => {
                resolve(detail)
            })
        })
    },
    UpdateChittyDetails: (chittyId, data) => {

        let sala = parseInt(data.MonthlyInstallment) * parseInt(data.NumberOfMonths)
        data.Sala = sala

        return new Promise((resolve, reject) => {
            db.get().collection(collection.CHIT_COLLECTION).updateOne({ _id: objectId(chittyId) }, {
                $set: {
                    ChittyNumber: data.ChittyNumber,
                    MonthlyInstallment: data.MonthlyInstallment,
                    NumberOfMonths: data.NumberOfMonths,
                    DateOfChitty: data.DateOfChitty,
                    Sala: data.Sala
                }
            }).then(() => {
                resolve()
            })
        })
    },
    deleteChitty: (chittyId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CHIT_COLLECTION).removeOne({ _id: objectId(chittyId) }).then(() => {
                resolve()
            })
        })
    },
    addClient: (chittyNo, data) => {
        return new Promise((resolve, reject) => {
            data.ChittyNumber = chittyNo
            
            db.get().collection(collection.CLIENTS_COLLECTION).insertOne(data).then(() => {
                resolve()
            })
        })
    },
    getClients: (chittyNo) => {
        return new Promise(async (resolve, reject) => {
            let clients = await db.get().collection(collection.CLIENTS_COLLECTION).find({ ChittyNumber: chittyNo }).toArray()
            resolve(clients)
        })
    },
    getClientDetails: (clientId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CLIENTS_COLLECTION).findOne({ _id: objectId(clientId) }).then((details) => {
                

                console.log(details);
                resolve(details)
            })
        })
    },
    updateClient: (clientId, data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CLIENTS_COLLECTION).updateOne({ _id: objectId(clientId) }, {
                $set: {
                    chittaalNumber: data.chittaalNumber,
                    name: data.name,
                    pricedStatus: data.pricedStatus
                }
            }).then(() => {
                resolve()
            })
        })
    },
    removeClient: (clientId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CLIENTS_COLLECTION).removeOne({ _id: objectId(clientId) }).then(() => {
                resolve()
            })
        })
    },
    getSingleChittyDetails: (chittyNo) => {
        return new Promise(async (resolve, reject) => {
            console.log(chittyNo);
            console.log('pull');
            await db.get().collection(collection.CHIT_COLLECTION).findOne({ ChittyNumber: chittyNo }).then((detail) => {
                console.log(detail);
                resolve(detail)
            })
        })
    },
    getOneClientDetails: (chittyNo) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CLIENTS_COLLECTION).findOne({ ChittyNumber: chittyNo }).then((details) => {
                resolve(details)
            })
        })
    },
    addInstallment: (chittyNo, data) => {
        return new Promise(async (resolve, reject) => {
            
            let chitdetails = await db.get().collection(collection.CHIT_COLLECTION).findOne({ ChittyNumber: chittyNo })

            //for(let i=0;i<=l;i++){


            //  

            data.MonthlyInstallment = chitdetails.MonthlyInstallment,
                data.NumberOfMonths = chitdetails.NumberOfMonths,
                data.Sala = chitdetails.Sala

            data.Date = chitdetails.DateOfChitty,

                


                data.ChittyNumber = chitdetails.ChittyNumber,


                
            data.Date = chitdetails.DateOfChitty
            console.log('avasanam');

            db.get().collection(collection.INSTALLMENT_COLLECTION).insertOne(data).then(async(instDetails) => {
                let installment=instDetails.ops[0].Installment
                let amount =instDetails.ops[0].Amount
                let instId=instDetails.ops[0]._id
                let month=instDetails.ops[0].Month
                let year=instDetails.ops[0].Year
                let date=instDetails.ops[0].Date
                let monthly=instDetails.ops[0].MonthlyInstallment
                let tmonths=instDetails.ops[0].NumberOfMonths
                let sala=instDetails.ops[0].Sala
                let detail= await db.get().collection(collection.CLIENTS_COLLECTION).find({ChittyNumber:chittyNo}).toArray()
                let l=detail.length
               
                console.log('hi');
                console.log(l);
              let data={}
                for(let i=0;i<l;i++){
                    data={
                        installId:instId,
                        clientId: detail[i]._id,
                        Installment:installment,
                        Amount:amount,
                        Month:month,
                        Year:year,
                        Date:date,
                        MonthlyInstallment:monthly,
                        NumberOfMonths:tmonths,
                        Sala:sala,
                        PaymentStatus: 'Pending'
                    }
                    console.log('loop over');
                    db.get().collection(collection.PAYMENT_COLLECTION).insert(data)
                    console.log('hello');
                   }
               
                resolve()
            })
        })
    },
    getLastInstallment: (chittyNo) => {
        console.log(chittyNo);
        return new Promise(async (resolve, reject) => {
            let details = await db.get().collection(collection.INSTALLMENT_COLLECTION).find({ ChittyNumber: chittyNo }).toArray()
            let lastInstall = details[details.length - 1]
            console.log(lastInstall);
            resolve(lastInstall)
        })
    },
    editInstallment: (installId, data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.INSTALLMENT_COLLECTION).updateOne({ _id: objectId(installId) }, {
                $set: {
                    Installment: data.Installment,
                    Amount: data.Amount,
                    Month: data.Month,
                    ChittyNumber: data.ChittyNumber,
                    Year: data.Year
                }
            }).then(() => {
                resolve()
            })
        })
    },
    getCompleteDetails:(clientID)=>{
      return new Promise(async(resolve,reject)=>{
     
      console.log('Enthuv'+clientID);
     let detail=await db.get().collection(collection.PAYMENT_COLLECTION).find({clientId:objectId(clientID)}).toArray()
    
     console.log(detail);
     console.log('kazhinj');
     
                   resolve(detail)
                
     
        })
    },
    getPaymentStatus:(clientID)=>{
        return new Promise(async(resolve,reject)=>{
          await  db.get().collection(collection.PAYMENT_COLLECTION).findOne({clientId:clientID}).then((detail)=>{
              let Status= detail.PaymentStatus
              resolve(Status)
          })
        })
    },
    changePaymentStatus:(instId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PAYMENT_COLLECTION).updateOne({installId:objectId(instId)},{
                $set: {
                    PaymentStatus: 'Paid'

                }
                
            }).then(()=>{
                console.log('eduth');
                resolve()
            })
                
        })
    },









    getUserDetails:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let chittyNo=data.ChittyNumber
            let chittaalNo=data.chittaalNumber
            console.log(chittyNo);
            console.log(chittaalNo);
            
          await  db.get().collection(collection.CLIENTS_COLLECTION).findOne({ChittyNumber:chittyNo,chittaalNumber:chittaalNo}).then((clientDetails)=>{
              console.log(clientDetails);
                resolve(clientDetails)
            })
        })
    },
    
    


}