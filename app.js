require('dotenv').config()
require('express-async-errors')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const connectDB = require('./server/db/connectDB')

const recipeRoutes = require('./server/routes/main')
const categoryRoutes = require('./server/routes/categories')
const usersAuthRoutes = require("./server/routes/usersAuth");

const errorHandler = require('./server/middleware/error-handler')
const notFound = require("./server/middleware/notFound");

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const passport = require('passport')
const initializePassport = require('./server/utils/passport-config')
const initializeGooglePassport = require('./server/utils/google-passport-config')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
  })
);
app.use(express.json());
app.use(
  helmet()
);
app.use(cors());
app.use(xss());

app.use(express.static('public'))
app.use(express.static('views'))

app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))

app.use(
  fileUpload({
    limits: {
      fileSize: 2 * 1024 * 1024, 
    },
  })
);

initializePassport(passport)
initializeGooglePassport(passport)


app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req, res, next) => {
    res.locals.success_flash = req.flash('success_flash')
    res.locals.error_flash = req.flash("error_flash");
    res.locals.error = req.flash("error");
    next()
})

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

app.use(methodOverride('_method'))
app.use('/', recipeRoutes)
app.use("/", usersAuthRoutes);
app.use('/categories', categoryRoutes)

app.set('layout', './layout/main')
app.set('view engine', 'ejs')

app.use(errorHandler)
app.use(notFound);

app.post('/admin/add-item', (req, res) => {
  const itemName = req.body.itemName;
  const itemNameLocalized = req.body.itemNameLocalized;
  const itemDescription = req.body.itemDescription;
  const itemDescriptionLocalized = req.body.itemDescriptionLocalized;
  const itemImages = req.body.itemImages;
  
});

const port = process.env.PORT || 4000

const startApp = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, ()=>console.log(`App is listening on port ${port}`))
    
  } catch (error) {
    console.log(error)
  }
}

startApp()
