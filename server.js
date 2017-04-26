//
// # SimpleServer
var restify = require("restify")
var firebase = require("firebase")
var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

//firebase config
var config = {
    apiKey: "AIzaSyAquS10ngNsMR056OXXbB9Q_QxQwkY41zQ",
    authDomain: "my-first-app-4b7ee.firebaseapp.com",
    databaseURL: "https://my-first-app-4b7ee.firebaseio.com",
    projectId: "my-first-app-4b7ee",
    storageBucket: "my-first-app-4b7ee.appspot.com",
    messagingSenderId: "1040734450719"
  };
firebase.initializeApp(config);

//database
var database = firebase.database();

//port
server.listen(8080, function(err){
  console.log(process.env.PORT, process.env.IP);
  console.log("connected at:" + "8080");
});

server.get('/listMember', function(req, res, next){
  var memberID = req.query.id;
  var result = new Promise(function(resolve, reject){
    var databaseLink = "member/";
    if(memberID != null){
      databaseLink+=memberID; 
    }
    var booksRef = database.ref(databaseLink);
    booksRef.once('value').then(function(sn){
      var json = sn.val();
      var size = sn.numChildren();
      if (json != null){
        if(memberID != null){
          size = 1;
        }
        resolve({
          success: true,
          list: json,
          size: size
        });
      }
      else{
        resolve({
          success: false,
          message: "fail"
        });
      }
    });
  });
  
  result.then(function(value){
    res.send(value);
    res.end();
  });
});

server.post('/addMember',function(req, res, next){
  var result = new Promise(function(resolve, reject){
    if(req.headers['content-type'] != 'application/json'){
      resolve({
        success: false,
        message: "fail"
      });
    }
    else{
      var json = req.body;
      var id = req.query.id;
      var databaseLink = "member/"+id;
      firebase.database().ref(databaseLink).set(json);
      resolve({
        success: true,
        memberID: id
      });
    }
  });
  result.then(function(value){
    res.send(value);
    res.end();
  });
});

server.patch("/updateMemberInfo", function(req, res, next){
  var result = new Promise(function(resolve, reject){
    if(req.headers['content-type']=='application/json'){
      var memberID = req.query.id;
      var json = req.body;
      if(memberID != null && json != null){
        var databaseLink = "member/" + memberID;
        firebase.database().ref(databaseLink).update(json);
        resolve({
          success: true,
          id: memberID,
          update: json
        });
      }
      else{
        resolve({
          success: false
        });
      }
    }
    else{
      resolve({success: false});
    }
  });
  result.then(function(value){
    res.send(value);
    res.end();
  });
});

server.del('/deleteMember', function(req, res, next){
  var result = new Promise(function(resolve, reject){
    var memberID = req.query.id;
    if(memberID != null){
      var databaseLink="member/" + memberID;
      firebase.database().ref(databaseLink).remove();
      resolve({
        success: true,
        message: "deleted"
      });
    }
    else{
      resolve({
        success: false,
        message: "fail_To_Delete"
      });
    }
  });
  result.then(function(value){
    res.send(value);
    res.end();
  });
});