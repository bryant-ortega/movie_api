// requirements + frameworks
const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path"),
    uuid = require("uuid"),
    mongoose = require("mongoose"),
    Models = require("./models.js"),
    bodyParser = require("body-parser");

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
    flags: "a",
});

const { check, validationResult } = require("express-validator");

app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
let allowedOrigins = [
    "http://localhost:8080",
    "http://testsite.com",
    "https://ortega-myflix.herokuapp.com",
    "http://localhost:1234",
    "https://en.wikipedia.org",
    "https://bryantortegamyflixapp.netlify.app",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                // If a specific origin isn’t found on the list of allowed origins
                let message =
                    "The CORS policy for this application doesn’t allow access from origin " +
                    origin;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        },
    })
);

app.use(bodyParser.json());

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");


// models
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Welcome to myflix!");
});

// MONGOOSE Get all movies
app.get('/movies', passport.authenticate('jwt',{session:false}), (req, res) => {
  Movies.find({ Movies: req.params.Movies })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
            });
    }
);

// MONGOOSE Get movie by title
app.get(
    "/movies/:Title",
    
    (req, res) => {
        Movies.findOne({ Title: req.params.Title })
            .then(movie => {
                res.json(movie);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

// MONGOOSE Get Genre By Name
app.get(
    "/movies/genre/:Name",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.findOne({ "Genre.Name": req.params.Name })
            .then(movie => {
                res.json(movie.Genre);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

//MONGOOSE Get Director Info By Name
app.get(
    "/movies/director/:Name",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Movies.findOne({ "Director.Name": req.params.Name })
            .then(movie => {
                res.json(movie.Director);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

// MONGOOSE Add a user
app.post(
    "/users",
    // Validation logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check("Username", "Username 5 alphanumeric characters long is required").isLength({ min: 5 }),
        check(
            "Username",
            "Username contains non alphanumeric characters - not allowed."
        ).isAlphanumeric(),
        check("Password", "Password is required").not().isEmpty(),
        check("Email", "Email does not appear to be valid").isEmail(),
    ],
    (req, res) => {
        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then(user => {
                if (user) {
                    //If the user is found, send a response that it already exists
                    return res
                        .status(400)
                        .send(req.body.Username + " already exists");
                } else {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                    })
                        .then(user => {
                            res.status(201).json(user);
                        })
                        .catch(error => {
                            console.error(error);
                            res.status(500).send("Error: " + error);
                        });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).send("Error: " + error);
            });
    }
);

// MONGOOSE Get all users
app.get(
    "/users",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.find()
            .then(users => {
                res.status(201).json(users);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

// MONGOOSE Get a user by username
app.get(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOne({ Username: req.params.Username })
            .then(user => {
                res.json(user);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

// MONGOOSE Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                },
            },
            { new: true } // This line makes sure that the updated document is returned
        )
            .then(user => {
                if (!user) {
                    return res
                        .status(400)
                        .send(req.params.Username + "not found");
                }
                res.json(user);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

// MONGOOSE Add a movie to a user's list of favorites
app.post(
    "/users/:Username/movies/:MovieID",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $push: { FavoriteMovies: req.params.MovieID },
            },
            { new: true } // This line makes sure that the updated document is returned
        )
            .then(user => {
                if (!user) {
                    return res
                        .status(400)
                        .send(req.params.Username + "not found");
                }
                res.json(user);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

//MONGOOSE Delete movie from list of favorites
app.delete(
    "/users/:Username/movies/:MovieID",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $pull: { FavoriteMovies: req.params.MovieID },
            },
            { new: true } // This line makes sure that the updated document is returned
        )
            .then(user => {
                if (!user) {
                    return res
                        .status(400)
                        .send(req.params.Username + "not found");
                }
                res.json(user);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

//MONGOOSE DELETE user
app.delete(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username })
            .then(user => {
                if (!user) {
                    res.status(400).send(
                        req.params.Username + " was not found"
                    );
                } else {
                    res.status(200).send(req.params.Username + " was deleted.");
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error: " + err);
            });
    }
);

app.get(
    "/secreturl",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.send("This is a secret url with super top-secret content.");
    }
);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log("Listening on Port " + port);
});

