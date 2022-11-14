const express = require('express');

var router = express.Router();
const fs = require('fs');
const Joi = require('joi');
const cors = require('cors');

//an array of course objects with 2 attributes each
const foods = [
  {id: 1, name: 'pizza', calories:500},
  {id: 2, name: 'salad', calories: 100},
  {id: 3, name: 'ice cream', calories: 700},
  {id: 4, name: 'apples', calories: 70},
];

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

const mongoose = require('mongoose')
const User = require("./userSchemaMongo") //import that model created in userSchemaMongo.js


mongoose.connect("mongodb+srv://jesseC:mongo4999@cluster0.kva1ucs.mongodb.net/?retryWrites=true&w=majority",
    ()=> {
      console.log("connected succesz")
    },
    e=> console.error(e)
)

//getFoodsByEmail("mylesMotha");

async function getFoodsByEmail(userEmail){
  //get the user object
  const userFound=await findUser(userEmail);
  if(userFound!==-1){
    console.log("food gucci");
    // for(let i=0; i<userFound.foods.length; i++){
    //     console.log(userFound.foods[i]);
    // }
    return userFound.foods;

  }else{
    console.log("food NOT gucci");
  }
}

async function findUser(emailTofind) {
  const userFound = await User.findOne({email: emailTofind});
  if(!userFound){
    console.log("doesnt exist");
    return -1;
  }else{
     //console.log(userFound);
    return userFound;
  }
}


////////////////////////////////// GET ROUTE HANDLERS ///////////////////////////////////////


router.get('/api/foods',cors(), (req, res) => {

  //TODO: RIGHT HERE
  findUser("mylesMotha").then((user) => {
    console.log(user);
    res.send(user.foods);
  });


})


router.get('/api/activities',cors(), (req, res) => {
  res.send(activities);
})

router.get('/api/days',cors(), (req, res) => {
  res.send(days);
})


////////////////////////////////// GET ROUTE HANDLERS ///////////////////////////////////////


//checks the activities array to find one with matching id, request was made as a string so parseInt
router.get('/api/activities/:id',cors(), (req, res) =>{
  const activity=activities.find(c=> c.id === parseInt(req.params.id));
  //if(!course) res.status(404).send('404!!! course with given id was not found'); //404 means object not found
  res.send(activity);
})

router.get('/api/foods/:name', cors(), (req, res) => {
  const food=foods.find(req.params.name);
  res.send(food);
})





////////////////////////////////// POST ROUTE HANDLERS ///////////////////////////////////////


router.post('/api/foods', (req, res)=> {
  // const {error} = validateCourse(req.body);
  // if(error) {
  //   res.status(400).send('post oopsie');
  // }
  const food = {
   id: foods.length+1,
   name: req.body.name,
    caloriesOut: req.body.calories
  };
  foods.push(food);
  res.send(food);
});

router.post('/api/activities', (req, res)=> {
  // const {error} = validateCourse(req.body);
  // if(error) {
  //   res.status(400).send('post oopsie');
  // }
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
  // const {error} = validateCourse(req.body);
  // if(error) {
  //   res.status(400).send('post oopsie');
  // }
  const day = {
    date: days.length+1,
    intake: req.body.intake,
    burned: req.body.burned
  };
  days.push(day);
  res.send(day);
});

////////////////////////////////// POST ROUTE HANDLERS ///////////////////////////////////////




// app.post('/api/food/makeFile', (req, res)=>{
//   fs.appendFile('oopsies.txt', 'Hello pizz!', function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });
// });

////////////////////////////////// PUT ROUTE HANDLERS ///////////////////////////////////////

router.put('/api/activities/:id', (req, res) =>{
  //console.log(req.params.id);
  const course=activities.find(c=> c.id === parseInt(req.params.id));
  if(!course) res.status(404).send('404!!!  id was not found'); //404 means object not found

  //validate the course,
  //if invalid, return 400 = Bad request

 // const result = validateCourse(req.body);

  //"object destructuring"
  //const {error} = validateCourse(req.body);
  // if(error) {
  //   res.status(400).send(`put oopsie ${req.params.id}`);
  // }

  //update course
  course.name = req.body.name;

  //return updated course to the client
  res.send(course.name);
});






/////////////////////////// DELETE ROUTE HANDLERS ////////////////////////////////////

router.delete('/api/activities/:id', (req, res) => {
  //look up course
  const course=activities.find(c=> c.id === parseInt(req.params.id));
  //if not there => return 404
  if(!course) res.status(404).send('404!!!  id was not found'); //404 means object not found

  //else delete it
  const index = activities.indexOf(course);
  activities.splice(index, 1);//seems like there's 10 other ways to delete this object, here's one way

  //return the course that was deleted to client
  res.send(course);
});



function validateCourse(course){
  const schema ={
    name: Joi.string().min(3).required()
  };
  return result= Joi.valid(course, schema);
}


module.exports = router;
