const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path");

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
    flags: "a",
});

let topMovies = [
    {
        title: "The Godfather",
        director: "Francis Ford Coppola",
    },
    {
        title: "The Godfather II",
        director: "Francis Ford Coppola",
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        director: "Peter Jackson",
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        director: "Peter Jackson",
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        director: "Peter Jackson",
    },
    {
        title: "Goodfellas",
        director: "Martin Scorsese",
    },
    {
        title: "Snatch",
        director: "Guy Ritchie",
    },
    {
        title: "The Dark Night",
        director: "Christopher Nolan",
    },
    {
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
    },
    {
        title: "Amadeus",
        director: "Milos Forman",
    },
];

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get("/movies", (req, res) => {
    res.json(topMovies);
});

app.get("/", (req, res) => {
    res.send("A default textual response of my choosing.");
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
