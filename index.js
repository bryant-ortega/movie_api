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
        description: "the first installment in The Godfather trilogy, chronicling the Corleone family under patriarch Vito Corleone (Brando) from 1945 to 1955. It focuses on the transformation of his youngest son, Michael Corleone (Pacino), from reluctant family outsider to ruthless mafia boss.",
        genre: {
            name: "Crime Drama",
            description:
                "Crime Drama is a sub-genre of drama that focuses on crimes, the criminals that commit them and the police that catch them. There are many formats of Crime drama such as detective, forensic/medical, procedural etc…"
        },
        director: {
            name: "Francis Ford Coppola",
            bio: "Born April 7, in Detroit, Coppola is descended from musically gifted Southern Italians who immigrated to New York in the early 20th century. His maternal grandfather, Francesco Pennino, was a songwriter, and his father, Carmine, first flute for the NBC Symphony under Toscanini.",
            birthyear: "1939"
        },
    },
    {
        title: "The Godfather II",
        description: "Part II juxtaposes two stories: that of Michael Corleone (played, as in The Godfather, by Al Pacino) in the years after he becomes head of the Corleone family business and that of his father, Vito Corleone, as a young man (portrayed by Robert De Niro).",
          genre: {
            name: "Crime Drama",
            description:
                "Crime Drama is a sub-genre of drama that focuses on crimes, the criminals that commit them and the police that catch them. There are many formats of Crime drama such as detective, forensic/medical, procedural etc…"
        },
        director: {
            name: "Francis Ford Coppola",
            bio: "Born April 7, in Detroit, Coppola is descended from musically gifted Southern Italians who immigrated to New York in the early 20th century. His maternal grandfather, Francesco Pennino, was a songwriter, and his father, Carmine, first flute for the NBC Symphony under Toscanini.",
            birthyear: "1939"
        },
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        description: "The surviving members of the Fellowship have split into three groups. Frodo and Sam face many perils on their continuing quest to save Middle-earth by destroying the One Ring in the fires of Mount Doom. Merry and Pippin escape from the Orcs and must convince the Ents to join the battle against evil.",
          genre: {
            name: "Fantasy Fiction",
            description:
                "Fantasy fiction is a genre of writing in which the plot could not happen in real life (as we know it, at least). Often, the plot involves magic or witchcraft and takes place on another planet or in another — undiscovered — dimension of this world."
        },
        director: {
            name: "Peter Jackson",
            bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
            birthyear: "1961"
        },
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        description: "The culmination of nearly 10 years' work and conclusion to Peter Jackson's epic trilogy based on the timeless J.R.R. Tolkien classic, "The Lord of the Rings: The Return of the King" presents the final confrontation between the forces of good and evil fighting for control of the future of Middle-earth.",
          genre: {
            name: "Fantasy Fiction",
            description:
                "Fantasy fiction is a genre of writing in which the plot could not happen in real life (as we know it, at least). Often, the plot involves magic or witchcraft and takes place on another planet or in another — undiscovered — dimension of this world."
        },
        director: {
            name: "Peter Jackson",
            bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
            birthyear: "1961"
        },
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        description: "Sauron, the Dark Lord, has awakened and threatens to conquer Middle-earth. To stop this ancient evil once and for all, Frodo Baggins must destroy the One Ring in the fires of Mount Doom. Men, Hobbits, a wizard, an Elf, and a Dwarf form a fellowship to help him on his quest.",
          genre: {
            name: "Fantasy Fiction",
            description:
                "Fantasy fiction is a genre of writing in which the plot could not happen in real life (as we know it, at least). Often, the plot involves magic or witchcraft and takes place on another planet or in another — undiscovered — dimension of this world."
        },
        director: {
            name: "Peter Jackson",
            bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
            birthyear: "1961"
        },
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
        bio: 
        birth: "1939",
    },
    {
        name: "Peter Jackson",
        bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
        birth: "1961",
    },
    {
        name: "Martin Scorsese",
        bio: "American filmmaker known for his harsh, often violent depictions of American culture. From the 1970s Scorsese created an ambitious body of work that made him one of the most important filmmakers of the late 20th and early 21st centuries.",
        birth: "1942",
    },
];

let users = [
    {
        username: "bryantortega",
    },
       {
        username: "sebastinkolman",
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
