
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { 


  CompanySignup, DriverSignup, Login, AddDelivery, GetDeliveryList, UpdateDeliveryStatus, UpdateDriverLocation, getDriverLocation,


 } = require('./Functions/Product');

const fileUpload = require('express-fileupload');
 
app.use(fileUpload());
const { DeleteInDb, FindInDb, UpdateInDb, SendMail, RemoveKeys } = require('./Functions/libs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false, limit: '50mb'}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});
  

app.put('/UpdateProfileDoctor', function(req, res){
  const {body} = req;
  if(!Object.keys(body).includes('Id')){
    res.status(500).send({Code:"01", Message:"Update id not found!"})
  }
  else{
    UpdateInDb('Users' , body)
    .then(result=>{
      res.status(200).send(result)
    })
    .catch(err=>{
      res.status(500).send(err)
    })
  }
});


app.post('/LoginForDriver', function(req, res){
  const {body} = req;
    Login(body)
    .then(result=>{
      res.status(200).send(result);
    })
    .catch(err=>{
      res.status(500).send(err);
    })
});

app.post('/CompanySignup', function(req, res){
  const {body} = req;
  CompanySignup(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

app.post('/InsertDriver', function(req, res){
  const {body} = req;
  DriverSignup(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

app.post('/InsertDelivery', function(req, res){
  const {body} = req;
  AddDelivery(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

app.put('/UpdateDeliveryStatus', function(req, res){
  const {body} = req;
  UpdateDeliveryStatus(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

app.put('/UpdateDriverLocation', function(req, res){
  const {body} = req;
  UpdateDriverLocation(body)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

app.get('/DriverGettingPendingDelivery', function(req, res){
  const {query} = req;
  GetDeliveryList(query)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

app.get('/searchAddress', function(req, res){
  const {query} = req;
  DriverSignup(query)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})


app.get('/getDriverLocation', function(req, res){
  const {query} = req;
  getDriverLocation(query)
  .then(result=>{
    res.status(200).send(result);
  })
  .catch(err=>{
    res.status(500).send(err);
  })
})

// app.post('/InsertSpeciality', function(req, res){
//   const {body} = req;
//   InsertSpeciality(body)
//   .then(result=>{
//     res.status(200).send(result);
//   })
//   .catch(err=>{
//     res.status(500).send(err);
//   })
// })


// app.put('/UpdateSpeciality', function(req, res){
//   const {body} = req;
//   if(!Object.keys(body).includes('Id')){
//     res.status(500).send({Code:"01", Message:"Update id not found!"})
//   }
//   else{
//     UpdateInDb('Speciality' , body)
//     .then(result=>{
//       res.status(200).send(result)
//     })
//     .catch(err=>{
//       res.status(500).send(err)
//     })
//   }
// });

// app.delete('/DeleteSpeciality', function(req, res){
//   const {body} = req;
//   if(!Object.keys(body).includes('Id')){
//     res.status(500).send({Code:"01", Message:"Delete id not found!"});
//   }
//   else{
//     DeleteInDb('Speciality' , body)
//     .then(result=>{
//       res.status(200).send(result);
//     })
//     .catch(err=>{
//       res.status(500).send(err);
//     });
//   }
// });

// app.post('/InsertCity', function(req, res){
//   const {body} = req;
//   InsertCity(body)
//   .then(result=>{
//     res.status(200).send(result);
//   })
//   .catch(err=>{
//     res.status(500).send(err);
//   })
// });



// app.put('/UpdateCity', function(req, res){
//   const {body} = req;
//   if(!Object.keys(body).includes('Id')){
//     res.status(500).send({Code:"01", Message:"Update id not found!"})
//   }
//   else{
//     UpdateInDb('City' , body)
//     .then(result=>{
//       res.status(200).send(result)
//     })
//     .catch(err=>{
//       res.status(500).send(err)
//     })
//   }
// });


app.use('/static', express.static('public'));

app.listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});