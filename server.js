require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
// const bcrypt = require("bcrypt");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const session = require("express-session");
const connectDB = require("./db/connect");
// const User = require("./models/users");
const Book = require('./models/books');
const Author = require('./models/authors');
const bodyParser = require('body-parser');

// -----------------Req Routes-----------------------
const genre_routes = require("./routes/genreroutes");
const author_routes = require("./routes/authorRoutes")
const books_routes = require("./routes/bookroutes");
const auth_routes = require('./routes/authroutes');
const publisher_routes = require("./routes/publisher");
// -----------------Req Routes-----------------------

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// passport.use(new LocalStrategy(
//     async function (name, password, done) {

//         try {

//             const user = await User.findOne({ name });

//             if (!user) {

//                 return done(null, false, { message: "Invalid Username." });

//             }

//             const passwordMatch = await bcrypt.compare(password, user.password);

//             if (!passwordMatch) {

//                 return done(null, false, { message: "Invalid Password" });

//             }

//             return done(null, user);

//         } catch (error) {

//             return done(error)

//         }

//     }
// ));

// app.use(passport.initialize());



// app.use(passport.session({}));

// app.get('/admin', function (req, res, next) {

//     if (!req.isAuthenticated()) {

//         return res.redirect('/login');

//     }

//     if (req.user.role !== 'admin') {

//         return res.status(403).send('Forbidden');

//     }
//     res.render('admin');
// });

const port = process.env.Port || 3030;


app.use("/auth", auth_routes);
app.use("/book", books_routes);
app.use("/genre", genre_routes);
app.use("/author", author_routes);
app.use("/publisher", publisher_routes);

app.get("/", (req, res) => {
    res.send("Hello");
})

const start = async () => {

    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(port, () => {
            console.log(`${port} Connected`);
        })
    }
    catch (error) {
        console.log(error);
    }

}

start();
