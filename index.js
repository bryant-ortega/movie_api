const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path"),
    uuid = require("uuid"),
    bodyParser = require("body-parser");

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
    flags: "a",
});

app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/cfDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get("/topMovies", (req, res) => {
    res.json(topMovies);
});

// app.get("/topMovies/:title", (req, res) => {
//     const { title } = req.params;
//     const movie = topMovies.find(movie => movie.title === title);

//     if (movie) {
//         return res.status(200).json(movie);
//     } else {
//         res.status(400).send("No such movie");
//     }
// });
// //READ genre by name
// app.get("/topMovies/genres/:genreName", (req, res) => {
//     const { genreName } = req.params;
//     const genre = topMovies.find(
//         movie => movie.genres.genreName === genreName
//     ).genres;

//     if (genre) {
//         return res.status(200).json(genre);
//     } else {
//         res.status(400).send("No such genre");
//     }
// });
// //READ director by name
// app.get("/topMovies/directors/:directorName", (req, res) => {
//     const { directorName } = req.params;
//     const director = topMovies.find(
//         movie => movie.directors.directorName === directorName
//     ).directors;

//     if (director) {
//         return res.status(200).json(director);
//     } else {
//         res.status(400).send("No such director");
//     }
// });

// MONGOOSE Get all movies
app.get("/movies", (req, res) => {
    Movies.find()
        .then(movies => {
            res.status(201).json(movies);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// MONGOOSE Add a user
app.post("/users", (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then(user => {
            if (user) {
                return res
                    .status(400)
                    .send(req.body.Username + "already exists");
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: req.body.Password,
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
});

// MONGOOSE Get all users
app.get("/users", (req, res) => {
    Users.find()
        .then(users => {
            res.status(201).json(users);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// MONGOOSE Get a user by username
app.get("/users/:Username", (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

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
app.put("/users/:Username", (req, res) => {
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
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});


// MONGOOSE Add a movie to a user's list of favorites
app.post("/users/:Username/movies/:MovieID", (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $push: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});

//MONGOOSE Delete movie from list of favorites
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $pull: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});

//MONGOOSE DELETE user
app.delete("/users/:Username", (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then(user => {
            if (!user) {
                res.status(400).send(req.params.Username + " was not found");
            } else {
                res.status(200).send(req.params.Username + " was deleted.");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.get("/", (req, res) => {
    res.send("Welcome to myflix!");
});

app.get("/secreturl", (req, res) => {
    res.send("This is a secret url with super top-secret content.");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});
