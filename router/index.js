const express = require('express');
const router = express.Router();
const userModel = require('./user.js')
const postModel = require('./post.js')
const upload = require('./multer.js');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));



//routes
 
router.get('/', (req, res) => {
  let mess = req.flash('error')
   res.render('login', { error: mess });
});

router.get('/profile', isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user })
  .populate('posts')
  res.render('profile', {user});
});

router.get('/register', (req, res) => {
  res.render('register')
});

router.get('/home', isLoggedIn, async (req, res) => {
  let allposts = await postModel.find()
  res.render('feed', {allposts})
});



//login, register and upload img
router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
if (!req.file) {
return res.status(400).send('No files were uploaded.');
}

let user = await userModel.findOne({ username: req.session.passport.user })
let postdata = await postModel.create({
  image: req.file.filename,
  imageText: req.body.filecaption,
  user: user._id
})
user.posts.push(postdata._id)
await user.save()
res.redirect('/profile')
});

router.post('/register', (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect('/home')
    })
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true
}), function(req, res){
})

router.get('/logout', function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}


module.exports = router;