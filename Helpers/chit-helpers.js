var db = require('../config/connection')
var collection = require('../config/collections')
var Promise=require('promise')

module.exports= {
addNewchit:(data)=>{
    return new Promise((resolve,reject)=>{

   
    db.get().collection(collection.CHIT_COLLECTION).insertOne(data).then(()=>{
        resolve()
    })
})
},
getAllchits: ()=>{
    return new Promise(async(resolve,reject)=>{
        await db.get().collection(collection.CHIT_COLLECTION).find().then((details)=>{
            resolve(details)
        })
    })
}
}