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
async function checkIfFoodExists(email, foodNameToFind){
    const userFound=await getUserObjectByEmail(email);
    if(userFound!==false){
      for(let i=0; i<userFound.foods.length; i++){
        //console.log(userFound.foods[i]);
        if(userFound.foods[i].name!==null&&userFound.foods[i].name===foodNameToFind){
          //console.log("food and user exist");
          return true;
        }
      }
      //console.log("user exists, food didnt");
      return false;
    }else{
      //console.log(foodNameToFind.name+" user doesnt exist");
      return false;
    }
}



async function checkIfActivityExists(email, activityToFind){
  //todo
}
async function checkIfDateExists(email, dateToFind){
  const userFound=await getUserObjectByEmail(email);
  if(userFound!==false){
    console.log('date to find: '+dateToFind);
    console.log();
    for(let i=0; i<userFound.days.length; i++){
      console.log(userFound.days[i].Day);
      if(userFound.days[i].Day.toString()===dateToFind.toString()){ //todo: need some way to compare dates
        console.log("its a match for date!")
      }
    }



  }
}
//////////////////////////////////////////////////////////////////////////////////END MONGO HELPER FUNCTIONS



////////////////////////////////// GET ROUTE HANDLERS ///////////////////////////////////////


router.get('/api/getAllFoods',cors(), async (req, res) => {
  if (await checkIfUserExists(req.body.email)) {
      const user = await getUserObjectByEmail(req.body.email);
      res.send(user.foods);
  }else{
    res.send(false);
  }

})

router.get('/api/getAllActivities',cors(), async (req, res) => {
  if (await checkIfUserExists(req.body.email)) {
    const user = await getUserObjectByEmail(req.body.email);
    res.send(user.activities);
  } else {
    res.send(false);
  }
})

router.get('/api/getAllDays',cors(), async (req, res) => {
  if (await checkIfUserExists(req.body.email)) {
    const user = await getUserObjectByEmail(req.body.email);
    res.send(user.days);
  } else {
    res.send(false);
  }
})

router.get('/api/getOneDay',cors(), async (req, res) => {
  if (await checkIfUserExists(req.body.email)) {
    const user = await getUserObjectByEmail(req.body.email);
    await checkIfDateExists(req.body.email, req.body.day);
    res.send(true);
  } else {
    res.send(false);
  }
})
/////////////////////////////////////////////////////////////////////////END GET ROUTE HANDLERS




////////////////////////////////// POST ROUTE HANDLERS ///////////////////////////////////////

//INSERT A NEW DATE  ////////////////////////////////
router.post('/api/insertNewDay', async (req, res) => {
  if (await insertFood(req.body.email, req.body.Days)) {
    console.log(req.body.Days);
    res.send(true);
  } else {
    res.send(false);
  }
});





//////////////////////////////////////////////////

//INSERT A NEW FOOD  /////////////////////////////////
router.post('/api/insertNewFood', async (req, res) => {
  if (await insertFood(req.body.email, req.body.foodToAdd)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function insertFood(userEmail, newFoodObject){
  const userFound=await getUserObjectByEmail(userEmail);
  if(userFound!==false){
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
    //console.log("updating a food that doesnt exist ");
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



//INSERT A NEW ACTIVITY  /////////////////////////////////
router.post('/api/insertNewActivity', async (req, res) => {
  if (await insertActivity(req.body.email, req.body.activityToAdd)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

async function insertActivity(userEmail, newActivityObject){
  const userFound=await getUserObjectByEmail(userEmail);
  if(userFound!==false){
    for(let i=0; i<userFound.activities.length; i++){
      console.log(userFound.activities[i]);
      if(userFound.activities[i].name!==null&&userFound.activities[i].name===newActivityObject.name){
        console.log("ACTIVITY ALREADY EXISTS")
        //todo: we could decide if we want to reject duplicates right here, now we just update them
        userFound.activities[i].name=newActivityObject.name;
        userFound.activities[i].calories=newActivityObject.calories;
        await userFound.save();
        console.log("updated and existing activity gucci");
        return true;
      }
    }
    console.log("updating an activity that doesnt exist ");
    userFound.activities.push(newActivityObject);
    //userFound.foods[userFound.foods.length+1]=newFoodObject;
    await userFound.save();
    return true;
  }else{
    console.log("error getting the user when inserting a new activity");
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


/////////////////////////////////////////////////////////////////////////END POST ROUTE HANDLERS




////////////////////////////////// PUT ROUTE HANDLERS ///////////////////////////////////////

//UPDATE AN EXISTING FOOD  /////////////////////////////////
router.put('/api/updateExistingFood', async (req, res) => {
 //todo: may want to not all duplicate foods?
  if (await updateFood(req.body.email, req.body.foodToUpdate, req.body.newFoodInfo)) {
    res.send(true);
  } else {
    console.log("failed to post food update")
    res.send(false);
  }
});

async function updateFood(userEmail, foodToUpdate, newFoodObject){
  if(await checkIfUserExists(userEmail)){
    const userFound=await getUserObjectByEmail(userEmail);
    for(let i=0; i<userFound.foods.length; i++){
      console.log(userFound.foods[i]);
      if(userFound.foods[i].name===foodToUpdate){
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
