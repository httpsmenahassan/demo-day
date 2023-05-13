const FoodModel = require('./models/food.js');
const FridgeModel = require('./models/fridge.js');


const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');


// // Set storage engine
// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename: function(req, file, cb) {
//     cb(null, req.body.imageName + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // 1MB
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// })//.single('myImage');

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif/;

//   // Check extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//   // Check mime type
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }


module.exports = function (app, passport, db, multer, ObjectID) {

  // Create (post) - upload a photo -- which will result in a food in the collection, when we upload a photo a food is created
  // Create (post) - add items to pantry
  // API - get one recipe idea via chatGPT, 
  // Read (GET) - what percentage of items we have for each recipe and then the user could select a recipe to focus on -- if you see you're missing something for a recipe, have a button to add it to the pantry
  // Delete (delete) - delete food object from DB
  // photos -- are the photos a class or an attribute of the class?
  // class Food, class Recipe - has an array of ingredients, each ingredient is a food
  // ***potential nice to have: input to manually log food, allow users to have multiple recipe ideas
  // upload is primary input 
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

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
    // res.sendFile(__dirname + '/../views/index.html')
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

  app.post('/food', upload.single('groceries'), (req, res) => {
    // Read the image file as a buffer
    console.log(req.file)
    const imagePath = path.join(__dirname, `../public/uploads/${req.file.originalname}`);

    const imageBuffer = fs.readFileSync(imagePath);
    // Set the Azure Cognitive Services endpoint URL and headers
    const url = "https://eastus.api.cognitive.microsoft.com/vision/v3.2/detect?model-version=latest";
    const headers = {
      "Content-Type": "image/jpeg",
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
        const errorMsg = detectedFoods.length === 0 ? 'No foods detected.' : null
        res.render('groceryHaul.ejs', { user: req.user, detectedFoods: detectedFoods, fileName: req.file.filename, errorMsg })
      })
      .catch(error => console.error(error));
  })

  app.post('/groceryHaul', async (req, res) => {
    const newFridge = new FridgeModel()
    newFridge.imageFile = req.body.fileName
    newFridge.user = req.user._id
    req.body.food.forEach((f, i) => {
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
