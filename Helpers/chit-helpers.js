var db = require('../config/connection')
var collection = require('../config/collections')
var Promise = require('promise')
var objectId = require('mongodb').ObjectID
var bcrypt = require('bcrypt')
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
            db.get().collection(collection.CHIT_COLLECTION).findOne({ _id: objectId(chittyId) }).then((details) => {
                db.get().collection(collection.CHIT_COLLECTION).removeOne({ _id: objectId(chittyId) })
                let chittyNo = details.ChittyNumber
                db.get().collection(collection.CLIENTS_COLLECTION).deleteMany({ ChittyNumber: chittyNo })
                db.get().collection(collection.INSTALLMENT_COLLECTION).deleteMany({ ChittyNumber: chittyNo })
                resolve()
            })
        })

    },
    addClient: (chittyNo, data) => {
        return new Promise((resolve, reject) => {
            data.ChittyNumber = chittyNo
            data.PricedStatus = "Non-Prized"

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
                db.get().collection(collection.INSTALLMENT_COLLECTION).deleteMany({ clientId: objectId(clientId) })
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


            //  

            let MonthlyInstallment = chitdetails.MonthlyInstallment
            let NumberOfMonths = chitdetails.NumberOfMonths
            let Sala = chitdetails.Sala
            let Date = chitdetails.DateOfChitty

            let ChittyNumber = chitdetails.ChittyNumber
            let Year = data.Year
            let Installment = data.Installment
            let Month = data.Month
            let Amount = data.Amount

            let detail = await db.get().collection(collection.CLIENTS_COLLECTION).find({ ChittyNumber: chittyNo }).toArray()
            let l = detail.length

            console.log('hi');
            console.log(l);
            let details = {}
            for (let i = 0; i < l; i++) {
                details = {

                    clientId: detail[i]._id,
                    ChittyNumber: ChittyNumber,
                    Installment: Installment,
                    Amount: Amount,
                    Month: Month,
                    Year: Year,
                    Date: Date,
                    MonthlyInstallment: MonthlyInstallment,
                    NumberOfMonths: NumberOfMonths,
                    Sala: Sala,
                    PaymentStatus: 'Pending'
                }
                console.log('loop over');
                db.get().collection(collection.INSTALLMENT_COLLECTION).insert(details)

                console.log('hello');
            }


            for (i = 0; i < l; i++) {
                if (detail[i].PricedStatus == "Prized") {
                    let clientID = detail[i]._id

                    amount = chitdetails.MonthlyInstallment
                    let install = Installment
                    console.log(chittyNo)
                    db.get().collection(collection.INSTALLMENT_COLLECTION).updateOne({ clientId: objectId(clientID), ChittyNumber: chittyNo, Installment: install, PaymentStatus: "Pending" }, {
                        $set: {
                            Amount: amount
                        }
                    })
                }
            }
            resolve()
            //  })
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
    editInstallment: (chittyNo, data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.INSTALLMENT_COLLECTION).updateMany({ ChittyNumber: chittyNo }, {
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
    getCompleteDetails: (clientID) => {
        return new Promise(async (resolve, reject) => {

            console.log('Enthuv' + clientID);
            let detail = await db.get().collection(collection.INSTALLMENT_COLLECTION).find({ clientId: objectId(clientID) }).toArray()

            console.log(detail);
            console.log('kazhinj');

            resolve(detail)


        })
    },
    changePaymentStatus: (instId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.INSTALLMENT_COLLECTION).updateOne({ _id: objectId(instId) }, {
                $set: {
                    PaymentStatus: 'Paid'
                }
            }).then(() => {
                resolve()
            })
        })
    },
    changePayStatus: (instId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.INSTALLMENT_COLLECTION).updateOne({ _id: objectId(instId) }, {
                $set: {
                    PaymentStatus: 'Pending'
                }
            }).then(() => {
                resolve()
            })
        })
    },
    changeToPriced: (clientId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CLIENTS_COLLECTION).updateOne({ _id: objectId(clientId) }, {
                $set: {
                    PricedStatus: "Prized"
                }
            }).then(() => {
                resolve()
            })
        })
    },
    changeToNonPriced: (clientId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CLIENTS_COLLECTION).updateOne({ _id: objectId(clientId) }, {
                $set: {
                    PricedStatus: "Non-Prized"
                }
            }).then(() => {
                resolve()
            })
        })
    },
    LastChittaalNumber: (chittyNo) => {
        return new Promise(async (resolve, reject) => {
            let details = await db.get().collection(collection.CLIENTS_COLLECTION).find({ ChittyNumber: chittyNo }).toArray()
            let lastMan = details[details.length - 1]

            resolve(lastMan)
        })
    },









    getUserDetails: (data) => {
        return new Promise(async (resolve, reject) => {
            let chittyNo = data.ChittyNumber
            let chittaalNo = data.chittaalNumber
            console.log(chittyNo);
            console.log(chittaalNo);

            await db.get().collection(collection.CLIENTS_COLLECTION).findOne({ ChittyNumber: chittyNo, chittaalNumber: chittaalNo }).then((clientDetails) => {
                console.log(clientDetails);
                resolve(clientDetails)
            })
        })
    },
    doLogin: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {

            let user = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ UserName: userData.UserName })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        response.admin = user
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })

            } else {
                resolve({ status: false })
            }
        })
    },
    updatePassword: (data) => {
        return new Promise(async (resolve, reject) => {
            console.log('hi');
            let username = data.UserName
            let Oldpassword = data.OldPassword
            console.log(username);
            console.log(Oldpassword);
            console.log(data.NewPassword);
            data.NewPassword = await bcrypt.hash(data.NewPassword, 10)
            console.log(data.NewPassword);
         let details=await   db.get().collection(collection.ADMIN_COLLECTION).findOne({ UserName: username })
                if (details) {
                    bcrypt.compare(Oldpassword, details.Password).then((status)=>{
                    if(status){
                        db.get().collection(collection.ADMIN_COLLECTION).updateOne({UserName:username},{
                            $set:{
                                Password:data.NewPassword
                            }
                           
                        })                  
                        resolve({status:true})  
                }else{
                    resolve({status:false})
                }
                
            })
        }else{
                console.log('maatiyallo');
                resolve({status:false})
            }
            })
       

    },
    ViewAdmin:()=>{
        return new Promise(async(resolve,reject)=>{
     let details=  await   db.get().collection(collection.ADMIN_COLLECTION).find().toArray()
              resolve(details)
         console.log(details);
        })
    },
    Addadmin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.Password = await bcrypt.hash(data.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(data).then(()=>{
                resolve()
            })
        })
    }

}