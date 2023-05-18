const FoodModel = require('./models/food.js');
const FridgeModel = require('./models/fridge.js');
const { sendText } = require('./services/twilio.js');
const { Configuration, OpenAIApi } = require('openai')


const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const exp = require('constants');


module.exports = function (app, passport, db, multer, ObjectID) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  const upload = multer({ storage: storage })





  // normal routes ===============================================================

  // // show the home page (will also have our login links)
  // app.get('/', function (req, res) {
  //   res.render('index.ejs');
  //   // res.sendFile(__dirname + '/../views/index.html')
  // });

  app.get('/', function (req, res) {
    db.collection('fridges').find().toArray((err, fridges) => {
      if (err) return console.log(err)
      // for (let i = 0; i < fridges.length; i++) {
      //   console.log(fridges[i])
      // }
      fridges.forEach(fridge => {
        const { foods, username, phoneNumber } = fridge
        foods.forEach(food => {
          const { expirationDate, name } = food
          const today = new Date()
          const warningDate = new Date()
          // setting warningDate to two days before expirationDate
          warningDate.setDate(expirationDate.getDate() - 2)
          // simple comparison -- if today is the same day as warningDate then this will be true -- otherwise, it's false
          const isTwoDaysBefore = warningDate.getDate() == today.getDate()
          if (isTwoDaysBefore) {
            sendText({
              name: username,
              phoneNumber,
              food: name,
            })
          }
        })
      })

      res.render('index.ejs')
    })
  });

  app.get('/groceryHaul', isLoggedIn, function (req, res) {
    const currentUser = req.user.local.email
    db.collection('foods').find({ user: currentUser }).toArray((err, foods) => {
      if (err) return console.log(err)
      console.log({ foods })
      res.render('groceryHaul.ejs', {
        user: req.user,
        foods
      })
    })
  });


  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('foods').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        foods: result
      })
    })
  });


  app.get('/allFoods', isLoggedIn, function (req, res) {
    db.collection('fridges').find({ user: ObjectID(req.user._id) }).toArray((err, fridge) => {
      if (err) return console.log(err)
      res.render('allFoods.ejs', {
        user: req.user,
        fridge
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // food log routes ===============================================================


  // // Create an instance of model SomeModel
  // const awesome_instance = new SomeModel({ name: "awesome" });

  // // Save the new model instance asynchronously
  // await awesome_instance.save();

  // await SomeModel.create({ name: "also_awesome" });

  app.get('/manualFood', (req, res) => {
    res.render('manualGroceryHaul.ejs', { user: req.user })
  })



  app.post('/food', upload.single('groceries'), (req, res) => {
    // Read the image file as a buffer
    console.log(req.file)
    const imagePath = path.join(__dirname, `../public/uploads/${req.file.originalname}`);

    const imageBuffer = fs.readFileSync(imagePath);
    // Set the Azure Cognitive Services endpoint URL and headers
    const url = "https://eastus.api.cognitive.microsoft.com/vision/v3.2/detect?model-version=latest";
    const headers = {
      "Content-Type": "image/jpeg",
      "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY
    };

    // Set the request options
    const options = {
      method: 'POST',
      headers: headers,
      body: imageBuffer
    };

    fetch(url, options)
      .then(res => res.json())
      .then(jsonResponse => {
        // Do something with the response
        console.log(jsonResponse)
        const produce = jsonResponse.objects.map((obj) => obj.object)
        // const filtered = produce.filter((obj) => obj !== 'Food' && obj !== 'Fruit'))
        // const detectedFoods = [...new Set(produce.filter((obj) => obj !== 'Food' && obj !== 'Fruit' && obj !== 'Vegetable'))]
        const detectedFoods = [...new Set(produce)]

        // FoodModel.create({ user: req.user.local.email, quantity: 0, detectedFoods, image: `../public/uploads/${req.file.originalname}` }, (err, result) => {
        //   if (err) return console.log(err)
        //   console.log('saved to database')
        //   res.redirect('/profile')
        // })
        console.log(imagePath)
        console.log('detected foods:', detectedFoods)
        res.render('groceryHaul.ejs', { user: req.user, detectedFoods, fileName: req.file.filename, jsonResponse })
      })
      .catch(error => console.error(error));
  })

  app.post('/groceryHaul', async (req, res) => {
    const newFridge = new FridgeModel()
    newFridge.imageFile = req.body.fileName
    newFridge.detectedFoodsWithBoxes = req.body.detectedFoodsWithBoxes
    newFridge.user = req.user._id
    newFridge.username = req.user.local.username
    newFridge.phoneNumber = req.user.local.phoneNumber
    if (!Array.isArray(req.body.food)) {
      req.body.food = [req.body.food]; // Convert single input to an array
    }
    if (!Array.isArray(req.body.purchaseDate)) {
      req.body.purchaseDate = [req.body.purchaseDate]; // Convert single input to an array
    }
    req.body.food.forEach((f, i) => {
      console.log(req.body.purchaseDate[i])
      const newFood = {
        quantity: req.body.quantity[i],
        name: req.body.food[i],
        purchaseDate: req.body.purchaseDate[i],
        expirationDate: req.body.expirationDate[i],
      }
      newFridge.foods.push(newFood)
    })
    newFridge.save()
    res.redirect('/profile')

  })

  app.post('/getRecipe', async (req, res) => {
    console.log(req.body.ingredient)

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const ingredients = req.body.ingredient
    let prompt = 'Give me a recipe using only these ingredients:'
    ingredients.forEach(food => prompt += food + ',')
    console.log(prompt)
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const recipe = completion.data.choices[0].message.content
    console.log(completion.data.choices[0].message);
    res.render('recipe.ejs', {recipe})
  })


  app.put('/food', async (req, res) => {
    const food = await FoodModel.findById(ObjectID(req.body.foodId))
    food.quantity += req.body.upArrow ? 1 : -1
    food.save()
    res.send(food)
  })

  app.put('/updateText', async (req, res) => {
    const food = await FoodModel.findById(ObjectID(req.body._id))
    console.log(req.body.newValue)
    food.detectedFoods[req.body.index] = req.body.newValue
    // food.detectedFoods = ['one', 'two', 'three', 'four']
    food.save()
    res.send(food)
  })

  // check to see if Mongoose uses a different delete
  app.delete('/food', (req, res) => {
    db.collection('foods').findOneAndDelete({ _id: ObjectID(req.body.foodId) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}