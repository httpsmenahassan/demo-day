const FoodModel = require('./models/food.js');

module.exports = function(app, passport, db, multer, ObjectID) {

  // Create (post) - upload a photo -- which will result in a food in the collection, when we upload a photo a food is created
  // Create (post) - add items to pantry
  // API - get one recipe idea via chatGPT, 
  // Read (GET) - what percentage of items we have for each recipe and then the user could select a recipe to focus on -- if you see you're missing something for a recipe, have a button to add it to the pantry
  // Delete (delete) - delete food object from DB
  // photos -- are the photos a class or an attribute of the class?
  // class Food, class Recipe - has an array of ingredients, each ingredient is a food
  // ***potential nice to have: input to manually log food, allow users to have multiple recipe ideas
  // upload is primary input 


// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
        // res.sendFile(__dirname + '/../views/index.html')
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('foods').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            foods: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================


// // Create an instance of model SomeModel
// const awesome_instance = new SomeModel({ name: "awesome" });

// // Save the new model instance asynchronously
// await awesome_instance.save();

// await SomeModel.create({ name: "also_awesome" });

    app.post('/food', (req, res) => {
      FoodModel.create({name: req.body.name, quantity: 0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/food', async (req, res) => {
      const food = await FoodModel.findById(ObjectID(req.body.foodId))
      food.quantity += req.body.upArrow ? 1 : -1
      food.save()
        res.send(food)
      })

      // check to see if Mongoose uses a different delete
    app.delete('/food', (req, res) => {
      db.collection('foods').findOneAndDelete({_id: ObjectID(req.body.foodId)}, (err, result) => {
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
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
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
