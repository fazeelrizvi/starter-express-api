var MongoClient = require('mongodb').MongoClient;
const {DBURL} = require('./connection')
const { uuid } = require('uuidv4');
var nodemailer = require('nodemailer');

function CheckMandatory(Body, MandatoryFields){
    const BodyKeys = Object.keys(Body);
    return new Promise((res, rej)=>{
        let MissingParams = '';
        const MandatoryLength = MandatoryFields.length;
        MandatoryFields.map((MandatoryField, index)=>{
            if(!BodyKeys.includes(MandatoryField)){
                if(MandatoryLength == index+1){
                    MissingParams+=`${MandatoryField}`;
                }
                else{
                    MissingParams+=`${MandatoryField}, `;
                }
            }
            if(MandatoryLength == index+1){
                if(MissingParams!=''){
                    rej({Error:`Please include ${MissingParams}`, Code: "01"});
                }
                else{
                    res({Code:"00", })
                }
            }
        })
    })
}

function CheckNullAndEmpty(Body){
    return new Promise((res, rej)=>{
        let NullParams = '';
        BodyKeys = Object.keys(Body);

        const Bodylength = BodyKeys.length;

        BodyKeys.map((Key, index)=>{
                var SingleKeyValue =Body[`${Key}`];
                if(SingleKeyValue === "null" || SingleKeyValue == null || SingleKeyValue ===""){

                if(Bodylength == index+1){
                    NullParams+=`${Key}`;
                }
                else{
                    NullParams+=`${Key}, `;
                }
                }
                if(Bodylength == index+1){
                    console.log(NullParams)
                if(NullParams!=''){
                    rej({Error:`These fields are empty or null. ${NullParams}`, Code: "01"});
                }
                else{
                    res({Code:"00", })
                }
                }

        })
     
    })
}
function InsertInDb(Table, Body, callBackResult){
    Body.CreatedAt = new Date();
    Body.UpdatedAt = null;
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("LocationTrack");
            dbo.collection(Table).insertOne(Body, function(err, result) {
                if(err){
                  rej({Error:err, Code: "01"});
                }
                else{
                    if(callBackResult){
                        res({
                            Code:"00", 
                            Message:"Inserted successfully!",
                            Result:result
                        })
                    }
                    else{
                        res({
                            Code:"00", 
                            Message:"Inserted successfully!",
                        })
                    }
                
                }
            })
        }
    });
});
}

function InsertInDbWithCallbackResult(Table, Body){
    Body.CreatedAt = new Date();
    Body.UpdatedAt = null;

    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("LocationTrack");
            dbo.collection(Table).insertOne(Body, function(err, result) {
                console.log(result)
                if(err){
                  rej({Error:err, Code: "01"});
                }
                else{
                    res({
                        Code:"00", 
                        Message:"Inserted successfully!",
                        Result:result
                    })
                }
            })
        }
    });
});
}
function UpdateInDb(Table, Body){
    Body.UpdatedAt = new Date();
    let{
        Id
    } = Body;
    Id = JSON.parse(Id)
    delete Body.Id;
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("LocationTrack");
            dbo.collection(Table).findOneAndUpdate({_id:Id},  {$set: Body}, {returnNewDocument:false},  function(err, result){
                if(result.lastErrorObject.updatedExisting){
                 res({Code: "00", Message:"Updated successfully!", result});
                }
                else{
                 rej({Error:err, Code: "01", Message:"Error in Updating!"});
                }
             db.close();
            });
        }
    });
});
}

function DeleteInDb(Table, Body){
    let{
        Id
    } = Body;
    Id = JSON.parse(Id);
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("LocationTrack");
            dbo.collection(Table).deleteOne({_id:Id},  function(err, result){
                if(result.deletedCount>0){
                 res({Code: "00", Message:"Deleted successfully!", result});
                }
                else{
                 rej({Error:err, Code: "01", Message:"Error in Deleting!"});
                }
             db.close();
            });
        }
    });
});
}


function FindInDbGetSpecificParams(Table, Query, WillReturnObject){
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            rej({Error:err, Code: "01"});
        }
        else{
            var dbo = db.db("LocationTrack");
            dbo.collection(Table).find(Query).project(WillReturnObject).toArray(function(err, result) {
                if(!err){
                    if(result.length > 0){
                        res({Code: "00", Message:"Finded successfully!", Data:result});
                    }
                    else{
                        rej({Code: "02", Message:"No data found!", Data:result});
                    }
                   }
                   else{
                    rej({Error:err, Code: "01", Message:"Error in Finding!"});
                   }
                db.close();
              });
            // dbo.collection(Table).find(Query,{},function(err, result){
         
            // });
        }
    });
});
}

function FindInDb(Table, Query){
    return new Promise((res, rej)=>{
    MongoClient.connect(DBURL, function(err, db) {
        if (err){
            console.log(err)
            rej({Error:err, Code: "01"});
        }
        else{
            console.log('90s')
            var dbo = db.db("LocationTrack");
            dbo.collection(Table).find(Query, {}).toArray(function(err, result) {
                if(!err){
                    if(result.length > 0){
                        res({Code: "00", Message:"Finded successfully!", Data:result});
                    }
                    else{
                        rej({Code: "02", Message:"No data found!", Data:result});
                    }
                   }
                   else{
                    rej({Error:err, Code: "01", Message:"Error in Finding!"});
                   }
                db.close();
              });
            // dbo.collection(Table).find(Query,{},function(err, result){
         
            // });
        }
    });
});
}

function GetLastRecord(Table, UserId){
    return new Promise((res, rej)=>{
        MongoClient.connect(DBURL, function(err, db) {
            if (err){
                rej({Error:err, Code: "01"});
            }
            else{
            var dbo = db.db("LocationTrack");
            dbo.collection(Table).find({UserId}, {}).sort({_id: -1}).limit(1).toArray(function(err, Result) {
                console.log(Result)
                if (err){
                    rej({Error:err, Code: "01"});
                }
                else{
                    if(Result.length > 0){
                        console.log('Result')
                        console.log(Result)
                    res(Result[0])
                    }
                    else{
                    rej({Message:"No record found!", err, Code: "02"});
                    }
                }
            })
    }})

    })
}

function CheckIfExist(Table, Query){
    return new Promise((res, rej)=>{
        FindInDb(Table, Query)
        .then(finded=>{
        rej({Code: "01", Message:`${Table} Already Exist!`})
        })
        .catch(()=>{
            res({Code: "00", Message:`${Table} User Not Exist!`});
        })
    });
}

function CheckIfExistWithResult(Table, Query){
    return new Promise((res, rej)=>{
        FindInDb(Table, Query)
        .then(finded=>{
        rej({Code: "01", Message:`${Table} Already Exist!`, Result: finded})
        })
        .catch(()=>{
            res({Code: "00", Message:`${Table} User Not Exist!`});
        })
    });
}


function SendMail(Data) {
    return new Promise((res, rej)=>{
        
var transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: 'HelixPharmaNoreply@gmail.com',
      pass: 'znvryvctgmntwjwt'
    },

  });

    const {
        Name,
        Email, 
        Password
    } = Data;

    const headers =  {
        "x-priority": "1",
        "x-msmail-priority": "High",
        importance: "high"
    }
    var fieldheader = `Dear ${Name}, <br> Your new Password is ${Password} <br> Regards, <br> LocationTrack`
    var mailOptions = {
        from: 'HelixPharmaNoreply@gmail.com',
        to: Email,
        subject: 'LocationTrack - Forget Password',
        headers,
        priority:"high",
        html:fieldheader
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (JSON.stringify(error) != "null") {
          rej({Code:"01", Message:"Error in sending mail!", err:error})
        } else {
        res({Code:"00", Message:"sending!",})
        }
      })
})
}


function Total(Data, Key){
    return new Promise((res)=>{
        console.log('start')
        let Total = 0;
        Data.map((val, index)=>{
        let TimeInMins = val[Key];
        if(typeof TimeInMins == "number" && !isNaN(TimeInMins)){
            Total= Total+TimeInMins;
        }
        if(Data.length == index+1){
            res(Total)
        }
        });
        console.log('end')
        
    })
}
function PercentageCalculator(Data, Key, TotalTime){
    return new Promise((res)=>{
        const NewArray = [];
        Data.map((val, index)=>{
            let TimeInMins = val[Key];
            let Perc = (TimeInMins/TotalTime)*100;
            val.percentage = Perc;
            NewArray.push(val)
            if(Data.length == index+1){
                res(NewArray)
            }
            });
    })
}

function RemoveKeys(Data, Keys){
    const NewArray = [];
    return new Promise((res)=>{
        Data.map((val, index1)=>{
            Keys.map((key, index)=>{
                delete val[key];
                if(Keys.length == index+1){
                    NewArray.push(val)
                    if(Data.length == index1+1){
                        res(NewArray)
                    }
                }

            })
        })
    })
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


module.exports = {
    CheckMandatory,
    InsertInDb,
    UpdateInDb,
    DeleteInDb,
    FindInDb,
    CheckNullAndEmpty,
    CheckIfExist,
    GetLastRecord,
    SendMail,
    Total,
    PercentageCalculator,
    RemoveKeys,
    InsertInDbWithCallbackResult,
    CheckIfExistWithResult,
    FindInDbGetSpecificParams,
    formatDate
}
