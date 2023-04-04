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

let topMovies = [
    {
        title: "The Godfather",
        genre: "Crime Drama",
        director: "Francis Ford Coppola",
    },
    {
        title: "The Godfather II",
        genre: "Crime Drama",
        director: "Francis Ford Coppola",
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        genre: "Adventure Fiction",
        director: "Peter Jackson",
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        genre: "Adventure Fiction",
        director: "Peter Jackson",
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        genre: "Adventure Fiction",
        director: "Peter Jackson",
    },
    {
        title: "Goodfellas",
        genre: "Crime Drama",
        director: "Martin Scorsese",
    },
    {
        title: "Snatch",
        genre: "Heist Comedy",
        director: "Guy Ritchie",
    },
    {
        title: "The Dark Knight",
        genre: "Action",
        director: "Christopher Nolan",
    },
    {
        title: "Pulp Fiction",
        genre: "Crime Drama",
        director: "Quentin Tarantino",
    },
    {
        title: "Amadeus",
        genre: "Musical Drama",
        director: "Milos Forman",
    },
];

let directors = [
    {
        name: "Francis Ford Coppola",
        bio: "Born April 7, in Detroit, Coppola is descended from musically gifted Southern Italians who immigrated to New York in the early 20th century. His maternal grandfather, Francesco Pennino, was a songwriter, and his father, Carmine, first flute for the NBC Symphony under Toscanini.",
        birth year: "1939",
    },
    {
        name: "Peter Jackson",
        bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
        birth year: "1961",
    },
    {
        name: "Martin Scorsese",
        bio: "American filmmaker known for his harsh, often violent depictions of American culture. From the 1970s Scorsese created an ambitious body of work that made him one of the most important filmmakers of the late 20th and early 21st centuries.",
        birth year: "1942",
    },
];

let users = [
    {
        username: "bryantortega",
    },
       {
        username: "sebastinkolman",
    },

]

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
