const express = require('express');
var router = express.Router();
const cors = require('cors');

////////////////////////////////// MONGO DB OVERHEAD /////////////////////////////////////////////////
const mongoose = require('mongoose')
const User = require("./userSchemaMongo") //import that model created in userSchemaMongo.js

mongoose.connect("mongodb+srv://jesseC:mongo4999@cluster0.kva1ucs.mongodb.net/?retryWrites=true&w=majority",
    ()=> {
      console.log("connected succesz")
    },
    e=> console.error(e)
)
////////////////////////////////////////////////////////////////////////////////////END MONGO DB OVERHEAD

const activities = [
  {id: 1, name: 'running', minuteDuration:15, caloriesPerMinute:11},
  {id: 2, name: 'swimming', minuteDuration:30, caloriesPerMinute:15},
  {id: 3, name: 'walking', minuteDuration:120, caloriesPerMinute:7},
  {id: 4, name: 'basketball', minuteDuration:45, caloriesPerMinute:14},
];

const days = [
  {date: 1, intake: 1500, burned: 500},
  {date: 2, intake: 1300, burned: 600},
  {date: 3, intake: 1900, burned: 700},
];



////////////////////////////////// MONGO HELPER FUNCTIONS /////////////////////////////////////////////////
async function getFoodsByEmail(userEmail){
  //get the user object
  const userFound=await getUserObjectByEmail(userEmail);
  if(userFound!==false){
    console.log("food gucci");
    // for(let i=0; i<userFound.foods.length; i++){
    //     console.log(userFound.foods[i]);
    // }
    return userFound.foods;

  }else{
    console.log("food NOT gucci");
  }
}

async function getUserObjectByEmail(email) {
  const userFound = await User.findOne({email: email});
  if(!userFound){
    //console.log("doesnt exist");
    return false;
  }else{
     //console.log(userFound);
    return userFound;
  }
}

async function checkIfUserExists(email){
  const userFound = await User.findOne({email: email});
  if (userFound) {
    return true;
  } else {
    return false;
  }
}
async function checkIfFoodExists(email, foodToFind){
    const userFound = getUserObjectByEmail(email);
    if(userFound!==false){
      //todo: search for food
    }else{
      return false;
    }
}
async function checkIfActivityExists(email, activityToFind){
  //todo
}
async function checkIfDateExists(email, dateToFind){
  //todo
}
//////////////////////////////////////////////////////////////////////////////////END MONGO HELPER FUNCTIONS



////////////////////////////////// GET ROUTE HANDLERS ///////////////////////////////////////


router.get('/api/foods',cors(), (req, res) => {
  const emaiLString="mylesMotha";
  getUserObjectByEmail(emaiLString).then((user) => {
    //console.log(user);
    res.send(user.foods);
  });
})


router.get('/api/activities',cors(), (req, res) => {
  const emaiLString="mylesMotha";
  getUserObjectByEmail(emaiLString).then((user) => {
    //console.log(user);
    res.send(user.activities);
  });
})

router.get('/api/days',cors(), (req, res) => {
  const emaiLString="mylesMotha";
  getUserObjectByEmail(emaiLString).then((user) => {
    //console.log(user);
    res.send(user.days);
  });
})

/////////////////////////////////////////////////////////////////////////END GET ROUTE HANDLERS




////////////////////////////////// POST ROUTE HANDLERS ///////////////////////////////////////


//INSERT A NEW FOOD  /////////////////////////////////
router.post('/api/foods', (req, res)=> {

  const emaiLString="bob"; /// JUNK TEST DATA
  const newFoodToInsert = {
    name: "willysNewFood",
    calories: 499
  };

  if(insertFood(emaiLString, newFoodToInsert)){
    const ansString ="successfully posted: "
    console.log(ansString+newFoodToInsert);
    res.send(true);
  }else {
    console.log("failed to post food update")
    res.send(false);
  }
});

async function insertFood(userEmail, newFoodObject){
  const userFound=await getUserObjectByEmail(userEmail);
  if(userFound!==-1){
    for(let i=0; i<userFound.foods.length; i++){
      console.log(userFound.foods[i]);
      if(userFound.foods[i].name!==null&&userFound.foods[i].name===newFoodObject.name){
        console.log("FOOD ALREADY EXISTS")
        userFound.foods[i].name=newFoodObject.name;
        userFound.foods[i].calories=newFoodObject.calories;
        await userFound.save();
        console.log("updated and existing food gucci");
        return true;
      }
    }
    console.log("updating a food that doesnt exist ");
    userFound.foods.push(newFoodObject);
    //userFound.foods[userFound.foods.length+1]=newFoodObject;
    await userFound.save();
    return true;
  }else{
    console.log("error getting the user when inserting a new food");
    return false;
  }
}
/////////////////////////////////


// ADD A NEW USER /////////////////////////////////
router.post('/api/addUser', async (req, res) => {
  const userEmailToAdd = req.body.email;
  const userExists = await checkIfUserExists(userEmailToAdd);
  if (!userExists) {
    createNewUser(userEmailToAdd).then(r => {
      res.send("successfully added user: " + userEmailToAdd);
    });
  } else {
    res.send("user already exists");
  }


});

async function createNewUser(emailToUse) {
  let today = new Date().toISOString().slice(0, 10)
  const user = await User.create(
      {
        email: emailToUse,
        activities:[
          {name: 'running', calories: 100},
          {name: 'napping', calories: 19},
          {name: 'swimming', calories: 300}
        ],
        days:[
          {Day: today, caloriesIn: 9001, caloriesOut: 1},
          {Day: today, caloriesIn: 9002, caloriesOut: 2}
        ],
        foods:[
          {name: 'apples', calories: 70},
          {name: 'pineapples', calories: 65},
          {name: 'pie', calories: 400},
        ]
      }
  )
}
/////////////////////////////////


router.post('/api/activities', (req, res)=> {
  const activity = {
    id: activities.length+1,
    name: req.body.name,
    minuteDuration: req.body.minuteDuration,
    caloriesPerMinute: req.body.caloriesPerMinute
  };
  activities.push(activity);
  res.send(activity);
});

router.post('/api/days', (req, res)=> {
  const day = {
    date: days.length+1,
    intake: req.body.intake,
    burned: req.body.burned
  };
  days.push(day);
  res.send(day);
});

/////////////////////////////////////////////////////////////////////////END POST ROUTE HANDLERS




////////////////////////////////// PUT ROUTE HANDLERS ///////////////////////////////////////

//UPDATE AN EXISTING FOOD  /////////////////////////////////
router.put('/api/foods', (req, res)=> {
  /// JUNK TEST DATA /////
  const emaiLString="bob";
  const foodToFind="willysNewFood"
  const newFoodInfo = {
    name: "foodYouChanged",
    calories: 8989898
  };
  /////////////////////////
  if(updateFood(emaiLString, foodToFind, newFoodInfo)){
    const ansString ="successfully posted: "
    console.log(ansString+newFoodInfo);
    res.send(true);
  }else {
    console.log("failed to post food update")
    res.send(false);
  }
});

async function updateFood(userEmail, foodToFindName, newFoodObject){
  const userFound=await getUserObjectByEmail(userEmail);
  if(userFound!==-1){
    for(let i=0; i<userFound.foods.length; i++){
      console.log(userFound.foods[i]);
      if(userFound.foods[i].name===foodToFindName){
        console.log("FOOD MATCHES!!")
        userFound.foods[i]=newFoodObject;
        await userFound.save();
        console.log("update food gucci");
        return true;
      }
    }
  }else{
    console.log("update food NOT gucci");
    return false;
  }
}
/////////////////////////////////


// router.put('/api/activities/:id', (req, res) =>{
//   //console.log(req.params.id);
//   const course=activities.find(c=> c.id === parseInt(req.params.id));
//
//   course.name = req.body.name;
//
//
//   res.send(course.name);
// });






/////////////////////////// DELETE ROUTE HANDLERS ////////////////////////////////////

router.delete('/api/deleteUser', async (req, res) => {
  const emailToDelete = req.body.email;
  const userExists = await checkIfUserExists(emailToDelete);
  if (userExists) {
    deleteByEmail(emailToDelete).then(r => {
      res.send("successfully deleted: " + emailToDelete);
    });
  } else {
    res.send("failed to delete: " + emailToDelete+" does not exist");
  }


});

async function deleteByEmail(emailToDelete) {
  await User.deleteOne({email: emailToDelete}, function (err, docs){
    if (err){
      //console.log(err)
    }
    else{
      //console.log("Deleted User : ", docs);
    }
  }).clone();

}


/////////////////////////////////////////////////////////////////////////END DELETE ROUTE HANDLERS

module.exports = router;
