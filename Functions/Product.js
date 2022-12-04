
const fs = require('fs');
const { uuid } = require('uuidv4');
const { AddCounter } = require('./AddCounter');
var generator = require('generate-password');
const ExcelJS = require('exceljs');
const {
    CheckMandatory, 
    InsertInDb,
    UpdateInDb,
    CheckNullAndEmpty,
    CheckIfExist,
    FindInDb,
    GetLastRecord,
    SendMail,
    Total,
    PercentageCalculator,
    FindInDbGetSpecificParams,
    formatDate,
} = require('./libs');

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];


const MFCompany = [
    'Name',
    'Email',
    'Password'
];

const MFDrivers = [
    'Name',
    'PhoneNumber',
    'Email',
    'Password',
    'CompanyId',
];

const MFDelivery = [
    'Address',
    'LatLong',
    'DriverId',
    'Status',
    'DeliveryDate'
];



const MFDoctorSignup = [
    'Name',
    'PhoneNumber',
    'Email',
    'ClinicName',
    'CityId',
    'SpecialityId',
    'UserTypeId',
    'Password'
];



const MFAdminSignup = [
    'Name',
    'Email',
    'UserTypeId',
    'Password'
]



const MFLogin = [
    'PhoneNumber',
    'Password'
]

const MFLoginPortal = [
    'Email',
    'Password'
]

const MFSpeciality = [
    'Name',
]

const MFCity = [
    'Name',
];

const MFScreens = [
    'Name',
];

const MFGames = [
    'Name',
];


const MFTimeIn = [
    'ScreenId',
    'GameId',
];



const MFArticle = [
    'Title',
    'Description',
    'Pdf',
    'CategoryIdArray'

];

const MFNotifications = [
    'Title',
    'Description',
    'Link',
    'UserTypeId',
    'Image',
    'Color',
    'BackgroundColor'
];

const MFTimeSpent = [
    'StartDate',
    'EndDate',
    'UserId',
];

const MFQuestions = [
    'Question',
    'Answer1',
    'Answer2',
    'Answer3',
    'Answer4',
    'CorrectIndex'
];

const MFGFPQuestions = [
    'Image',
    'Answer1',
    'Answer2',
    'Answer3',
    'Answer4',
    'CorrectIndex'
];
const MFDashboardBanner = [
    'Base64',	
    'Type',
    'VideoUrl'
];

const MFGetDelivery = [
    'DriverId',	
    'Date',
];



const MFHangmanQuestions = [
    'Hint',
    'Answer',
];


const MFRewardItem = [
    'ImageBase64',
    'Title',
    'Description',
];

const MFNews = [
    'ThumbnailBase64',
    'BannerBase64',
    'Title',
    'Description',
    'Html'
];


const MFArticleCategory = [
    'Name',
    'Base64',
];

const MFGetScore  = [
    'UserId',
    'GameId',
];

// Track

function CompanySignup(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFCompany)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Company', {$or: [ {PhoneNumber: Body.PhoneNumber } , {Email: Body.Email} ]})
            .then(NotFound=>{
                AddCounter('Company').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Company', Body, true)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function searchAddress({
    value,
    forceGoogle
}){
    CheckNullAndEmpty( value,
        forceGoogle)
    .then(success=>{
        FindInDb('Deliveries', {"CreatedAt":{$gte: new Date(StartDate), $lt: new Date(EndDate)}, UserId })
        .then(async(next)=>{
           const {
               Data
           } = next;
           const FormatedData = await formatUsageData(Data);
           CalculateTimeBetween(FormatedData)
           .then((next)=>{
            res(next);
           })
           .catch((err)=>{
            rej(err)
            })
        })
        .catch((err)=>{
        rej(err)
        })
    })
    rej(err)
}
function DriverSignup(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFDrivers)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
                console.log(success)
            CheckIfExist('Drivers', {$or: [ {PhoneNumber: Body.PhoneNumber } , {Email: Body.Email} ]})
            .then(NotFound=>{
                console.log(NotFound)
                AddCounter('Drivers').then((result)=>{
                    console.log(result)
                    console.log('results')
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Drivers', Body, true)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}

function GetCompanyDrivers(Body){
return new Promise((res, rej)=>{
    CheckMandatory(Body, ['CompanyId'])
    .then(result=>{
        CheckNullAndEmpty(Body)
        .then(success=>{
            FindInDbGetSpecificParams('Drivers', Body, {CreatedAt:0, UpdatedAt:0})
            .then(async result=>{
                res(result)
            })
            .catch(err=>{
                rej(err)
        })
        })
        .catch(err=>{
                rej(err)
        })
    })
    .catch(err=>{
            rej(err)
    })
});
}


function GetDeliveryListAllStatus(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFGetDelivery)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(async(success)=>{
                let DeliveryStatus = await FindInDb('DeliveryStatus', {});
                DeliveryStatus = DeliveryStatus.Data;
                console.log(DeliveryStatus)
                const DriverName = await FindInDbGetSpecificParams('Drivers', {
                    _id:1
                }, {Name:1, _id:0})
                .then((json)=>json.Data[0].Name);
                Body.DeliveryDate = new Date(Body.Date);
                Body.DriverId = parseInt(Body.DriverId);
                delete Body.Date;
                delete Body.CompanyId;
                FindInDbGetSpecificParams('Delivery', Body, {CreatedAt:0, UpdatedAt:0})
                .then(async result=>{
                    const {
                        Data
                    } = result;
                    result.Data = Data.map((v => {
                    const StatusName = DeliveryStatus.find(x=>x._id == v.DriverId).Name;
                       return {...v, DriverName, Status:StatusName, DeliveryDate: formatDate(v.DeliveryDate)};
                    }))
                    res(result)
                })
                .catch(err=>{
                    rej(err)
            })
            })
            .catch(err=>{
                    rej(err)
            })
        })
        .catch(err=>{
                rej(err)
        })
    })
}

function GetDeliveryList(Body){
    return new Promise((res, rej)=>{
        Body.Status = 1;
      
        CheckMandatory(Body, MFGetDelivery)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
                Body.DeliveryDate = new Date(Body.Date);
                Body.DriverId = parseInt(Body.DriverId);
                delete Body.Date;
                console.log(Body)
                FindInDb('Delivery', Body)
                .then(async result=>{
                    res(result)
                })
                .catch(err=>{
                    rej(err)
            })
            })
            .catch(err=>{
                    rej(err)
            })
        })
        .catch(err=>{
                rej(err)
        })
    })
}

function AddDelivery(Body){
    return new Promise((res, rej)=>{
        Body.Status = 1;

        CheckMandatory(Body, MFDelivery)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
                Body.DeliveryDate = new Date(Body.DeliveryDate);
                Body.DriverId = parseInt(Body.DriverId);
        
                AddCounter('Delivery').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Delivery', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}

// Track
function InsertDBanner(Body){
    const {
        Base64,
    } = Body
    
    return new Promise((res, rej)=>{
    CheckMandatory(Body, MFDashboardBanner)
    .then(result=>{
        if(Base64 == null){
            AddCounter('ProductImages').then((result)=>{
                const {
                  WillLastId
                } = result;
                delete Body.Base64;
                Body._id = WillLastId;
                Body.src = null;
                InsertInDb('DashboardBanners', Body)
                .then(result=>{
                    res(result)
                })
                .catch(err=>{
                    rej(err)
                })
               }).catch((err)=>res.status(500).send(err))
        }
        else{
        let base64String = Base64; 
        let base64Image = base64String.split(';base64,').pop();
        let ImageExtention = base64String.split(';base64,')[0];
        ImageExtention = ImageExtention.split('/')[1];
        const ImageUniqueName = uuid();
        fs.writeFile(`./public/Uploads/${ImageUniqueName}.${ImageExtention}`, base64Image, {encoding: 'base64'}, function(err) {
            if(!err){
                AddCounter('ProductImages').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    delete Body.Base64;
                    Body._id = WillLastId;
                    Body.src = `${ImageUniqueName}.${ImageExtention}`;
                    InsertInDb('DashboardBanners', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>res.status(500).send(err))
            }
        });
    }
    })
    .catch(err=>{
        rej(err)
    });
    })
}
function AddUserDoctor(Body){
    return new Promise((res, rej)=>{
        Body.UserTypeId = 2;
        CheckMandatory(Body, MFDoctorSignup)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Users', {$or: [ {PhoneNumber: Body.PhoneNumber } , {Email: Body.Email} ]})
            .then(NotFound=>{
                AddCounter('Users').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Users', Body, true)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function AddUserAdmin(Body){
    return new Promise((res, rej)=>{
        Body.UserTypeId = 1;
        CheckMandatory(Body, MFAdminSignup)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Users',  {Email: Body.Email})
            .then(NotFound=>{
                AddCounter('Users').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Users', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function InsertSpeciality(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFSpeciality)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Speciality', {Name: Body.Name})
            .then(NotFound=>{
                AddCounter('Speciality').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Speciality', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function InsertCity(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFCity)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('City', {Name: Body.Name})
            .then(NotFound=>{
                AddCounter('City').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('City', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function Login(Body){
    return new Promise((res, rej)=>{
    CheckMandatory(Body, MFLogin)
    .then(next=>{
        CheckNullAndEmpty(Body)
    .then(next=>{
        FindInDb('Drivers', Body)
        .then(next=>{
            const {
                Name,
                _id,
                UserTypeId
            } = next.Data[0];
            res({Code:"00", Message:"Login successfully!", Data:{Id:_id, Name, UserTypeId}})
        })
        .catch(err=>{
            rej({Code:"01", Message:"Login Failed!"})
        });
    })
    .catch(err=>{
        rej(err)
    });
    })
    .catch(err=>{
        rej(err)
    });
    })
}

function LoginPortal(Body){
    return new Promise((res, rej)=>{
    Body.UserTypeId = 1;
    CheckMandatory(Body, MFLoginPortal)
    .then(next=>{
        CheckNullAndEmpty(Body)
    .then(next=>{
        FindInDb('Users', Body)
        .then(next=>{
            const {
                Name,
                _id,
            } = next.Data[0];
            res({Code:"00", Message:"Login successfully!", Data:{
                Name,
                UserId:_id,
            }})
        })
        .catch(err=>{
            rej({Code:"01", Message:"Login Failed!"})
        });
    })
    .catch(err=>{
        rej(err)
    });
    })
    .catch(err=>{
        rej(err)
    });
    })
}

function InsertBook(data){
    return new Promise( async (res, rej)=>{
    const{
    Pdf,
    CoverImage,
    Name,
    __dirname
    } = data;
    const PdfURL =  await UploadSingleFile(Pdf, __dirname);
    const CoverImageURL = await UploadSingleFile(CoverImage, __dirname);
    if(PdfURL && CoverImageURL){
        AddCounter('Books').then((result)=>{
            const {
              WillLastId
            } = result;
            const Body = {
                PdfURL,
                CoverImageURL,
                Name,
                _id:WillLastId
            };
            InsertInDb('Books', Body)
            .then(result=>{
                res(result)
            })
            .catch(err=>{
                rej(err)
            })
           }).catch((err)=>rej(err))
    }
    else{
        rej({Code:"01", Message:`Error in Uploading file, ${PdfURL}, ${CoverImageURL}` })
    }
 
    })
}


function UploadSingleFile(File, __dirname){
    return new Promise((res, rej)=>{
        AddCounter('Uploads').then((result)=>{
            const {
                WillLastId
              } = result;
            const Path = `${__dirname}/public/Uploads/${WillLastId}-${File.name}`;
            File.mv(Path, function(err) {
                if (!err){
                    res(`Uploads/${WillLastId}-${File.name}`);
                }
                else{
                    rej(null)
                }
              });
           }).catch((err)=>rej(err))
        
        })
}
function AddHostInBooks(arr, host){
    const NewArray = [];
    return new Promise((resolve,reject)=>{
        arr.map((Val, index)=>{
            Val.CoverImageURL = `http://${host}/static/${Val.CoverImageURL}`;
            Val.PdfURL = `http://${host}/static/${Val.PdfURL}`;
            NewArray.push(Val)
            if(arr.length == index+1){
                resolve(NewArray)
            }
        })
    })
}

function AddHostIArticles(arr, host){
    const NewArray = [];
    return new Promise((resolve,reject)=>{
        arr.map((Val, index)=>{
            Val.PdfURL = `http://${host}/static/${Val.PdfURL}`;
            NewArray.push(Val)
            if(arr.length == index+1){
                resolve(NewArray)
            }
        })
    })
}

function AddStaticUpload(arr, host, key){
    const NewArray = [];
    return new Promise((resolve,reject)=>{
        arr.map((Val, index)=>{
            if(Val[`${key}`] != null){
            Val[`${key}`] = `http://${host}/static/Uploads/${Val[`${key}`]}`;
            }
            NewArray.push(Val)
            if(arr.length == index+1){
                resolve(NewArray)
            }
        })
    })
}

function InsertArticle(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFArticle)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(async function(){
                const {
                    __dirname,
                    Pdf
                } = Body
                console.log(Pdf)
                const PdfURL =  await UploadSingleFile(Pdf, __dirname);
                delete Body.Pdf;
                delete Body.__dirname;
                Body.PdfURL = PdfURL;
                if(PdfURL!= null){
                    AddCounter('Articles').then((result)=>{
                        const {
                          WillLastId
                        } = result;
                        Body._id = WillLastId;
                        InsertInDb('Articles', Body)
                        .then(result=>{
                            res(result)
                        })
                        .catch(err=>{
                            rej(err)
                        })
                       }).catch((err)=>rej(err))
                }
                else{
                    rej({
                        Code:"01",
                        Message:"Error in uploading Pdf"
                    })
                }
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}



function InsertNotifications(Body){
    const Link = Body.Link;
    const Image = Body.Image;
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFNotifications)
        .then(result=>{
            delete Body.Link;
            delete Body.Image;
            CheckNullAndEmpty(Body)
            .then(success=>{
                console.log(Image)
                console.log('Image')
                if(Image == null || Image =="null"){
                    AddCounter('Notifications').then((result)=>{
                        const {
                          WillLastId
                        } = result;
                        Body._id = WillLastId;
                        Body.Link = Link;
                        console.log('Ok')
                        Body.ImageUrl = null;
                        InsertInDb('Notifications', Body)
                        .then(result=>{
                            res(result)
                        })
                        .catch(err=>{
                            rej(err)
                        })
          
                    }).catch((err)=>rej(err))
                }
                else{
                    AddCounter('Notifications').then((result)=>{
                        const {
                          WillLastId
                        } = result;
                        Body._id = WillLastId;
                        Body.Link = Link;
                        console.log('Ok')
                        Base64Upload(Image)
                        .then((ImageName)=>{
                            Body.ImageUrl = ImageName;
                            InsertInDb('Notifications', Body)
                            .then(result=>{
                                res(result)
                            })
                            .catch(err=>{
                                rej(err)
                            })
                            })
                        .catch(err=>{
                            rej(err)
                        })
          
                    }).catch((err)=>rej(err))
                }
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}



function InsertScreen(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFScreens)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Screens', {Name: Body.Name})
            .then(NotFound=>{
                AddCounter('Screens').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Screens', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}



function InsertGames(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFGames)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('Games', {Name: Body.Name})
            .then(NotFound=>{
                AddCounter('Games').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Games', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function TimeIn(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFTimeIn)
        .then(result=>{
            if(Body.ScreenId!="null" || Body.GameId!="null"){
                Body.TimeIn = new Date();
                AddCounter('Usage').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    GetLastRecord('Usage', Body.UserId)
                    .then((result)=>{
                    if(Object.keys(result).includes('TimeOut')){
                    InsertInDb('Usage', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                    }
                    else{
                        res({Code:"03", Message:"Last TimeOut Not found"})
                    }
                })
                .catch((err)=>{
                    if(err.Code == "02"){
                        InsertInDb('Usage', Body)
                        .then(result=>{
                            res(result)
                        })
                        .catch(err=>{
                            rej(err)
                        })
                    }
                    else{
                        rej(err)
                    }
                })

            }).catch((err)=>rej(err))
        }
        else{
            res({Code:"04", Message:"null parameters [ScreenId, GameId] ?"})
        }
        })
        .catch(err=>{
            rej(err)
        })
    })
}

function TimeOut(UserId){
    return new Promise((Resolve, Reject)=>{
        GetLastRecord('Usage', UserId)
        .then((result)=>{
            const {
                ScreenId,
                GameId
            } = result;

            if(Object.keys(result).includes('TimeIn')){
                let Body = {
                    ScreenId,
                    GameId,
                    UserId
                };
         
                Body.TimeOut = new Date();
                AddCounter('Usage').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    GetLastRecord('Usage', UserId)
                    .then((result)=>{
                    if(Object.keys(result).includes('TimeIn')){
                    InsertInDb('Usage', Body)
                    .then(result=>{
                        Resolve(result)
                    })
                    .catch(err=>{
                        Reject(err)
                    })
                    }
                    else{
                        Reject({Code:"01", Message:"Last record is not time in"})
                    }
                })
                }).catch((err)=>Reject(err))

            }
            else{
                Reject({Code:"01", Message:"Last record is not time in"})
            }
            })
            .catch(err=>{
                Reject(err)
            })

        })
}


async function CalculateTimeBetween(data){
    let Array = [];
    let TempTimeIn = null;
    let AllScreens =   await FindInDb('Screens', {});
    AllScreens = AllScreens.Data;
    let AllGames =   await FindInDb('Games', {});
    AllGames = AllGames.Data;
    // console.log(AllGames)


    return new Promise((res, rej)=>{
        data.map((obj, index)=>{
            index = index+1;
            // console.log(index)
            // console.log(obj)

            if(isOdd(index)){
                TempTimeIn = obj.TimeIn;
            }
            else{
                let {
                    TimeOut,
                    ScreenId,
                    GameId
                } = obj;

                ScreenId = JSON.parse(ScreenId)
                let ScreenName = null;
                let color = null;
                let IconName = null;
                if(ScreenId != null){
                    const Finded = AllScreens.find(x=> x._id == ScreenId);
                    ScreenName = Finded.Name;
                    color = Finded.Color;
                    IconName = Finded.IconName;
                }
                else{
                    ScreenName = AllGames.find(x=> x._id == GameId).Name;
                    color = AllGames.find(x=> x._id == GameId).Color;
                    IconName = AllGames.find(x=> x._id == GameId).IconName;
                }

                
                const diffTime = Math.abs(new Date(TempTimeIn) - new Date(TimeOut));
                const TimeInMins = Math.round(diffTime/(1000*60));
                if(!isNaN(TimeInMins)&& TimeInMins !=null){
                    if(TimeInMins > 0){
                        Array.push({
                            TimeInMins,
                            ScreenId,
                            GameId,
                            ScreenName,
                            color,
                            IconName
                        });
                    }
                }
            }
            if(data.length == index+1){
                if(Array.length !=0){
                CombineCommon(Array).then((result)=>{
                    res(result);
                })
                .catch((err)=>{
                    rej(err);
                })
                }
                else{
                    rej({
                        Code:"01", Message:"No time spent"
                    })
                }
            }
        });

    })
}
function reformTime (Mins){
  const HoursAndMin = Mins/60;
  const Hour = Math.floor(HoursAndMin);
  const Minutes =  (HoursAndMin-Hour)*60;
  if(Hour > 0 && Minutes > 0){
    return Hour+" Hour"+" and "+Minutes+" Minute";
  }
  else if(Hour > 0){
    return Hour+" Hour";
  }
  else if(Minutes > 0){
    return Minutes+" Minute";
  }
  else {
    return Minutes+" Minute";
  }
}
function CombineCommon(Data){
    const Array = []
    return new Promise((res, rej)=>{
        Data.map( async (val, index)=>{
            if(Array.length>0){
                if(Array.filter(x=>x.ScreenId == val.ScreenId).length > 0){
                    const findedIndex = Array.findIndex(x=>x.ScreenId ==val.ScreenId);
                    const findedData = Array[findedIndex];
                    const FTimeInMins = findedData.TimeInMins;
                    const {
                        TimeInMins
                    } = val;
                    const NewTime = FTimeInMins+TimeInMins;
                    findedData.TimeInMins = NewTime;
                    Array[findedIndex] = findedData;
                }
                else{
                Array.push(val);
                }
            }
            else{
                Array.push(val);
            }
            if(Data.length == index+1){
                const TotalTime = await Total(Array, 'TimeInMins');
                const WithPercentage = await PercentageCalculator(Array, 'TimeInMins', TotalTime);
                
                res({Code:"00", Result:{
                    TotalTime,
                    WithPercentage
                }})
            }
        })
    });
}

async function formatUsageData(Data){
return new Promise((res, rej)=>{
                    let FormatedData = [];
                   Data.map((single, index)=>{
                    if(!isOdd(FormatedData.length)){
                        if(Object.keys(single).includes('TimeIn')){
                            FormatedData.push(single)
                        }
                    }
                    else{
                        if(Object.keys(single).includes('TimeOut')){
                            FormatedData.push(single)
                        }
                    }
                    if(Data.length == index+1){
                        res(FormatedData)
                    }
                   })
})
}
function GetTimeSpent(Body){
    return new Promise(function (res, rej) {
        CheckMandatory(Body, MFTimeSpent)
        .then((next)=>{
            CheckNullAndEmpty(Body)
            .then(next=>{
                const {
                    StartDate,
                    EndDate,
                    UserId
                } = Body;
                FindInDb('Usage', {"CreatedAt":{$gte: new Date(StartDate), $lt: new Date(EndDate)}, UserId })
                .then(async(next)=>{
                   const {
                       Data
                   } = next;
                   const FormatedData = await formatUsageData(Data);
                   CalculateTimeBetween(FormatedData)
                   .then((next)=>{
                    res(next);
                   })
                   .catch((err)=>{
                    rej(err)
                    })
                })
                .catch((err)=>{
                rej(err)
                })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    });
}



function isOdd(n) {
    return Math.abs(n % 2) == 1;
}




function InsertQuestions(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFQuestions)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
                AddCounter('Questions').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('Questions', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}

function Base64Upload(base64String){
    return new Promise((res, rej)=>{
        let base64Image = base64String.split(';base64,').pop();
        let ImageExtention = base64String.split(';base64,')[0];
        ImageExtention = ImageExtention.split('/')[1];
        const ImageUniqueName = uuid();
        console.log(base64Image)
        console.log(ImageExtention)
        console.log('Test')
        fs.writeFile(`./public/Uploads/${ImageUniqueName}.${ImageExtention}`, base64Image, {encoding: 'base64'}, function(err) {
        console.log(err )
          
            if(!err){
                res( `${ImageUniqueName}.${ImageExtention}`)
            }
            else{

                rej({Code:"01", Message:"Error in uploading image"});
            }
        });
    })
}

function SetAnswersArray(Array) {
    const NewArray = [];
    return new Promise((res, rej)=>{
        Array.map((val, index)=>{
            const Answers = [val.Answer1, val.Answer2, val.Answer3, val.Answer4];
            delete val.Answer1;
            delete val.Answer2;
            delete val.Answer3;
            delete val.Answer4;
            val.Answers=Answers;
            NewArray.push(val);
            if(Array.length == index+1){
                res(NewArray);
            }
        })
    })
}


function InsertHangmanQuestions(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFHangmanQuestions)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
                AddCounter('HangmanQuestions').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('HangmanQuestions', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}

function UpdateDriverLocation(Body) {
    return new Promise((res, rej)=>{
        CheckNullAndEmpty(Body)
        .then(next=>{
            CheckMandatory(Body, ['Id', 'LatLong'])
            .then(next=>{
                UpdateInDb('Drivers', Body)
                .then(next=>{
                    res(next);
                })
                .catch((err)=>{
                    rej(err)
                })
            })
            .catch((err)=>{
                rej(err)
            })

        })
        .catch((err)=>{
            rej(err)
        })
    });
}

function UpdateDeliveryStatus(Body) {
    return new Promise((res, rej)=>{
        CheckNullAndEmpty(Body)
        .then(next=>{
            CheckMandatory(Body, ['Id', 'Status'])
            .then(next=>{
                Body.Status = parseInt(Body.Status)
                UpdateInDb('Delivery', Body)
                .then(next=>{
                    res(next);
                })
                .catch((err)=>{
                    rej(err)
                })
            })
            .catch((err)=>{
                rej(err)
            })

        })
        .catch((err)=>{
            rej(err)
        })
    });
}
function ForgotPassword({PhoneNumber}) {
    return new Promise((res, rej)=>{
        CheckNullAndEmpty({PhoneNumber})
        .then(next=>{
        FindInDb('Users', {PhoneNumber: PhoneNumber})
        .then(({Data})=>{
        const {_id, Email, Name} = Data[0];
        var Password = generator.generate({
            length: 8,
            numbers: true
        });
        UpdateInDb('Users', {Id:_id, Password})
        .then(next=>{
            SendMail({
                Name,
                Email, 
                Password
            })
            .then(()=>{
                res({Code:"00", Message:"Your new password sent on your email"})
            })
            .catch((err)=>{
                rej(err)
            })
        })
        .catch((err)=>rej(err))
        
        })
        .catch((err)=>rej(err))
    })
})
}

function getDriverLocation({Id}) {
    return new Promise((res, rej)=>{
        FindInDbGetSpecificParams('Drivers', {_id: parseInt(Id), }, {LatLong:1, _id:0})
        .then(async result=>{
          res(result);
        })
        .catch(err=>{
            rej(err);
        })
    })
}

function GetUserProfile({Id, UserTypeId}) {
    return new Promise((res, rej)=>{
        FindInDb('Users', {UserTypeId: parseInt(UserTypeId), _id: parseInt(Id)})
        .then(async result=>{
          const {
              Data
          } = result;
          const {
            CityId,
            SpecialityId
          } = Data[0];
          console.log(CityId)
         const CityName = await FindInDb('City', {_id: parseInt(CityId) })
          .then(({Data})=>{ return Data[0].Name})
          .catch(err=>{
            rej(err);
          });

          const SpecialityName = await FindInDb('Speciality', {_id: parseInt(SpecialityId)})
          .then(({Data})=>{ return Data[0].Name})
          .catch(err=>{
            rej(err);
          });

          delete Data[0].CityId;
          delete Data[0].SpecialityId;
          delete Data[0].CreatedAt;
          delete Data[0].UpdatedAt;
          Data[0].SpecialityName= SpecialityName; 
          Data[0].CityName= CityName; 
          res(result);
        })
        .catch(err=>{
            rej(err);
        })
    })
}


function InsertGFPQuestion(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFGFPQuestions)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
                AddCounter('GFPQuestions').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    Base64Upload(Body.Image)
                    .then((ImageName)=>{
                        Body.Image = ImageName;
                        InsertInDb('GFPQuestions', Body)
                        .then(result=>{
                            res(result)
                        })
                        .catch(err=>{
                            rej(err)
                        })
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}

async function AddCitySpecialityFromId(Data){
    return new Promise( async(res, rej)=>{

    const Cities =  await  FindInDb('City', {})
    .then(result=>{
        return result.Data
    })
    .catch(err=>{
      return null;
    });

    const Specialities =  await  FindInDb('Speciality', {})
    .then(result=>{
        return result.Data
    })
    .catch(err=>{
      return null;
    });
    const NewArray = [];
    Data.map((val,index)=>{
        const City = Cities.find(x=>x._id == val.CityId);
        const Speciality = Specialities.find(x=>x._id == val.SpecialityId);
        if(typeof Speciality != "undefined"){
            val.Speciality = Speciality.Name;
        }
        if(typeof City != "undefined"){
            val.City = City.Name;
        }
        NewArray.push(val);
        if(Data.length == index+1){
            res(NewArray)
        }
    })
});
}


function InsertRewardItem(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFRewardItem)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            
            CheckIfExist('RewardItems', {Title: Body.Title})
            .then(NotFound=>{
                const Image = Body.ImageBase64;
                Base64Upload(Image)
                .then((ImageName)=>{
                delete Body.ImageBase64;
                Body.ImageUrl = ImageName;
                AddCounter('RewardItems').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('RewardItems', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
                })
                .catch(err=>{
                    rej(err)
                })
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}

const unique = (arr, key) => {
    const keys = new Set();
    return arr.filter(el => !keys.has(el[key]) && keys.add(el[key]));
};
 
function GetTopScorerNew(date){
    return new Promise(async(res, rej)=>{
        let SDate = getmonthfirst(new Date());
        let EDate = getmonthlast(new Date());
        if(date != null){
             SDate = getmonthfirst(new Date(date));
             EDate = getmonthlast(new Date(date));
        }
  
        FindInDb('Usage', {"CreatedAt":{$gte: new Date(SDate), $lt: new Date(EDate)}})
        .then(async({Data})=>{
            const FinalData = [];
           const UData = unique(Data, 'UserId');
           for (let i = 0; i < UData.length; i++) {
                const {UserId} = UData[i];
                const SingleUserData = Data.filter(x=>x.UserId == UserId);
                const FormatedData = await formatUsageData(SingleUserData);
                if(FormatedData.length > 1){
                const Time =  await CalculateTimeBetween(FormatedData)
                    .then(({Result})=> Result)
                    .catch((err)=>err)
                if(typeof Time !="undefined"){
                    if(Object.keys(Time).includes('TotalTime')) {
                        const {TotalTime} = Time;
                        FinalData.push({
                            UserId:parseInt(UserId),
                            TotalTime
                        })
                        
                    }
                }
                     if(UData.length == i+1){
                        console.log(FinalData.length)
                        FinalData.sort(function(a, b) { 
                            return b.TotalTime - a.TotalTime  
                        });
                        const Top20 = FinalData.slice(0, 20);
                        const TopUserId = Top20.map(({UserId})=>UserId);
                        MergeWithUserData(TopUserId, Top20)
                        .then((result)=>{
                            res({
                                Code:"00",
                                Data:result
                            })
                        })
                        .catch((err)=>{
                            rej(err)
                        })
                     }
                    }
            }
        })
        .catch(err=>{
            rej({Code:"01", Message:"No data found!"})
        });

    });
}

function getTopScorerExcel(){
    return new Promise((res, rej)=>{
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('TopScorer');
        worksheet.columns = [
            {header:'S.No', key:'s.no', width:10},
            {header:'Name', key:'name', width:10},
            {header:'Phone Number', key:'pnumber', width:10},
            {header:'Time Spent', key:'time', width:10},
        ]
    })
}

 function MergeWithUserData(UserIDs, TimeData){
    return new Promise(async(res, rej)=>{
        const {Data} = await FindInDb('Users', { _id: { $in: UserIDs}});
        const mergedData = []
        Data.map((value, index)=>{
            const findTime = TimeData.find(x=>x.UserId == value._id);
            delete findTime.UserId
            findTime.Name=  value.Name;
            mergedData.push(findTime);
            if(Data.length == index+1){
                mergedData.sort(function(a, b) { 
                    return b.TotalTime - a.TotalTime  
                });
                res(mergedData)
            }
        })
    })
    
}

function GetTopScorer(Data){
    let NewData = [];
    return new Promise(async(res, rej)=>{
        var isoDate = new Date().toISOString().substring(0,10);
        const SDate = getmonthfirst(new Date());
        const EDate = getmonthlast(new Date());
        Data.map(async(data, index)=>{
            const {
                _id,
                Name
            } = data;
            const query = {
            StartDate:SDate,
            EndDate: EDate,
            UserId: (_id).toString()
           };
           const QueryResult = await GetTimeSpent(query).then((result)=>result).catch(()=>{ return{Code:"01"}})
              if(QueryResult.Code == "00"){
               const {
                Result
               } = QueryResult;
               const {
                   TotalTime
               } = Result;
               NewData.push({
                Name,
                TotalTime
               })
           }
            if(Data.length == index+1){
                setTimeout(() => {
                console.log('Ok JAnu')
                NewData.sort(function(a, b) { 
                    return b.TotalTime - a.TotalTime  
                  });
                NewData.slice(0,21)
                res({Data:NewData})
                }, 1000);
            }

           console.log('Okes')
        })
    })
}


function InsertNews(Body){
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFNews)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('News', {Title: Body.Title})
            .then(NotFound=>{
                const Image = Body.ThumbnailBase64;
                Base64Upload(Image)
                .then((ImageName)=>{
                delete Body.ThumbnailBase64;
                Body.ThumbnailImageUrl = ImageName;

                const Image2 = Body.BannerBase64;
                Base64Upload(Image2)
                .then((ImageName)=>{
                delete Body.BannerBase64;
                Body.BannerImageUrl = ImageName;
                AddCounter('News').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;
                    InsertInDb('News', Body)
                    .then(result=>{
                        res(result)
                    })
                    .catch(err=>{
                        rej(err)
                    })
                   }).catch((err)=>rej(err))
                })
                .catch(err=>{
                    rej(err)
                })
                })
                .catch(err=>{
                    rej(err)
                })
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}


function InsertArticleCategory(Body){
    const Image = Body.Base64;
    return new Promise((res, rej)=>{
        CheckMandatory(Body, MFArticleCategory)
        .then(result=>{
            CheckNullAndEmpty(Body)
            .then(success=>{
            CheckIfExist('ArticleCategories', {Name: Body.Name})
            .then(NotFound=>{
                AddCounter('ArticleCategories').then((result)=>{
                    const {
                      WillLastId
                    } = result;
                    Body._id = WillLastId;

                    delete Body.Base64;
                    Base64Upload(Image)
                    .then((ImageName)=>{
                        Body.ImageUrl = ImageName;

                        InsertInDb('ArticleCategories', Body)
                        .then(result=>{
                            res(result)
                        })
                        .catch(err=>{
                            rej(err)
                        })
             
                        })
                    .catch(err=>{
                        rej(err)
                    })

                 
                   }).catch((err)=>rej(err))
            }).catch((err)=>{
                rej(err)
            })
            })
            .catch(err=>{
                rej(err)
            })
        })
        .catch(err=>{
            rej(err)
        })
    })
}

function getScore(query){
    return new Promise((res, rej)=>{
        CheckMandatory(query, MFGetScore)
        .then(result=>{
            res(result)
        })
        .catch(err=>{
            rej(err)
        });
    })
}
module.exports = {
    CompanySignup,
    DriverSignup,
    AddDelivery,
    searchAddress,
    Login,
    GetDeliveryList,
    UpdateDeliveryStatus,
    UpdateDriverLocation,
    getDriverLocation,
    GetCompanyDrivers,
    GetDeliveryListAllStatus
}


function getmonthfirst(mydate){
    var firstDay = new Date(mydate.getFullYear(), mydate.getMonth(), 1);
    return firstDay;
  } 
  
  // get month last
  function getmonthlast(mydate){
    var lastDay = new Date(mydate.getFullYear(), mydate.getMonth() + 1, 0);
    return lastDay;
  }