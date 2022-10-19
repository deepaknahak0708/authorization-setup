require('dotenv').config();
require('./config/db')
const express = require('express');
const ejs = require('ejs');
const path = require('path')
const router = require('./routes/indexRoute');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport')
 require('./config/passport')(passport);
 const flash = require('connect-flash');
 const cookieParser = require('cookie-parser');
// const errorHandler = require('./middleware/errorHandler')
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false, limit: "100mb" }));


// mongo store--------
// const mongoStore = MongoStore.create({
//     mongoUrl: process.env.MONGO_URL,
//     ttl: 24 * 60 * 60, // = 24 hour
//     crypto: {
//         secret: process.env.SECRET_KEY
//     }
// })


// Session config---------
app.use(session({
    secret:process.env.SECRETE_KEY,
    resave: false,
    // store: mongoStore,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    } 
}))

// for cookie
app.use(cookieParser())
app.use(flash());
// ejs ------------------
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());


app.use(router);

// app.use(errorHandler);

app.listen(port, () => {
    console.log(`Successfully listeninig to the port ${port}`)
})