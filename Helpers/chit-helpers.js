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
            data.PaymentStatus = 'Pending'
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
            await db.get().collection(collection.CHIT_COLLECTION).findOne({ ChittyNumber: chittyNo }).then((detail) => {
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

            db.get().collection(collection.INSTALLMENT_COLLECTION).insertOne(data).then(() => {

               
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
    getCompleteDetails:(clientId)=>{
        return new Promise(async(resolve,reject)=>{
         await   db.get().collection(collection.CLIENTS_COLLECTION).findOne({_id:objectId(clientId)}).then(async(clientDetails)=>{
      let chittyNo= clientDetails.ChittyNumber
      let clientId= clientDetails._id
     let detail= await db.get().collection(collection.INSTALLMENT_COLLECTION).find({ChittyNumber:chittyNo}).toArray()
     let l=detail.length
     console.log('hi');
     console.log(l);
   let data={}
     for(let i=0;i<l;i++){
         data={
             installId:detail[i]._id,
             clientId: clientId,
             PaymentStatus: 'Pending'
         }
         console.log('loop over');
         db.get().collection(collection.PAYMENT_COLLECTION).insertOne(data)
         console.log('hello');
        }
        
     
                   resolve(detail)
                   console.log('kazhinj');
      })
        })
    }
    


}