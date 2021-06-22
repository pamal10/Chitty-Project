var db = require('../config/connection')
var collection = require('../config/collections')
var Promise = require('promise')
var objectId = require('mongodb').ObjectID

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
            await db.get().collection(collection.CHIT_COLLECTION).findOne({ _id: objectId(id)}).then((detail) => {
                resolve(detail)
            })
        })
    },
    UpdateChittyDetails: (chittyId,data)=>{
        
        let sala = parseInt(data.MonthlyInstallment) * parseInt(data.NumberOfMonths)
        data.Sala = sala

        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CHIT_COLLECTION).updateOne({_id:objectId(chittyId)},{
                $set: {
                    ChittyNumber : data.ChittyNumber,
                    MonthlyInstallment : data.MonthlyInstallment,
                    NumberOfMonths : data.NumberOfMonths,
                    DateOfChitty : data.DateOfChitty,
                    Sala : data.Sala
                }
            }).then(()=>{
                resolve()
            })
        })
    },
    deleteChitty: (chittyId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CHIT_COLLECTION).removeOne({_id:objectId(chittyId)}).then(()=>{
                resolve()
            })
        })
    }

}