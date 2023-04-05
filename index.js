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

app.use(bodyParser.json());

let topMovies = [
    {
        title: "The Godfather",
        description:
            "the first installment in The Godfather trilogy, chronicling the Corleone family under patriarch Vito Corleone (Brando) from 1945 to 1955. It focuses on the transformation of his youngest son, Michael Corleone (Pacino), from reluctant family outsider to ruthless mafia boss.",
        genres: {
            genreName: "Crime Drama",
            description:
                "Crime Drama is a sub-genre of drama that focuses on crimes, the criminals that commit them and the police that catch them. There are many formats of Crime drama such as detective, forensic/medical, procedural etc…",
        },
        directors: {
            directorName: "Francis Ford Coppola",
            bio: "Born April 7, in Detroit, Coppola is descended from musically gifted Southern Italians who immigrated to New York in the early 20th century. His maternal grandfather, Francesco Pennino, was a songwriter, and his father, Carmine, first flute for the NBC Symphony under Toscanini.",
            birthyear: "1939",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/The_Godfather#/media/File:Godfather_ver1.jpg",
        year: "1972",
        featured: "Yes",
    },
    {
        title: "The Godfather II",
        description:
            "Part II juxtaposes two stories: that of Michael Corleone (played, as in The Godfather, by Al Pacino) in the years after he becomes head of the Corleone family business and that of his father, Vito Corleone, as a young man (portrayed by Robert De Niro).",
        genres: {
            genreName: "Crime Drama",
            description:
                "Crime Drama is a sub-genre of drama that focuses on crimes, the criminals that commit them and the police that catch them. There are many formats of Crime drama such as detective, forensic/medical, procedural etc…",
        },
        directors: {
            directorName: "Francis Ford Coppola",
            bio: "Born April 7, in Detroit, Coppola is descended from musically gifted Southern Italians who immigrated to New York in the early 20th century. His maternal grandfather, Francesco Pennino, was a songwriter, and his father, Carmine, first flute for the NBC Symphony under Toscanini.",
            birthyear: "1939",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/The_Godfather_Part_II#/media/File:Godfather_part_ii.jpg",
        year: "1974",
        featured: "Yes",
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        description:
            "The surviving members of the Fellowship have split into three groups. Frodo and Sam face many perils on their continuing quest to save Middle-earth by destroying the One Ring in the fires of Mount Doom. Merry and Pippin escape from the Orcs and must convince the Ents to join the battle against evil.",
        genres: {
            genreName: "Fantasy Fiction",
            description:
                "Fantasy fiction is a genre of writing in which the plot could not happen in real life (as we know it, at least). Often, the plot involves magic or witchcraft and takes place on another planet or in another — undiscovered — dimension of this world.",
        },
        directors: {
            directorName: "Peter Jackson",
            bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
            birthyear: "1961",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings:_The_Two_Towers#/media/File:Lord_of_the_Rings_-_The_Two_Towers_(2002).jpg",
        year: "2002",
        featured: "Yes",
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        description:
            "The culmination of nearly 10 years' work and conclusion to Peter Jackson/'s epic trilogy based on the timeless J.R.R. Tolkien classic, 'The Lord of the Rings: The Return of the King' presents the final confrontation between the forces of good and evil fighting for control of the future of Middle-earth.",
        genres: {
            genreName: "Fantasy Fiction",
            description:
                "Fantasy fiction is a genre of writing in which the plot could not happen in real life (as we know it, at least). Often, the plot involves magic or witchcraft and takes place on another planet or in another — undiscovered — dimension of this world.",
        },
        directors: {
            directorName: "Peter Jackson",
            bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
            birthyear: "1961",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings:_The_Return_of_the_King#/media/File:The_Lord_of_the_Rings_-_The_Return_of_the_King_(2003).jpg",
        year: "2003",
        featured: "Yes",
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        description:
            "Sauron, the Dark Lord, has awakened and threatens to conquer Middle-earth. To stop this ancient evil once and for all, Frodo Baggins must destroy the One Ring in the fires of Mount Doom. Men, Hobbits, a wizard, an Elf, and a Dwarf form a fellowship to help him on his quest.",
        genres: {
            genreName: "Fantasy Fiction",
            description:
                "Fantasy fiction is a genre of writing in which the plot could not happen in real life (as we know it, at least). Often, the plot involves magic or witchcraft and takes place on another planet or in another — undiscovered — dimension of this world.",
        },
        directors: {
            directorName: "Peter Jackson",
            bio: "Born in Wellington, New Zealand. Both his parents were immigrants from England. Jackson started his film-making career at a young age and made home movies on his parents' cameras. He never had any formal training, but he explored using a variety of cameras, seeing what worked and what didn't.",
            birthyear: "1961",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring#/media/File:The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_(2001).jpg",
        year: "2001",
        featured: "Yes",
    },
    {
        title: "Goodfellas",
        description:
            "The lowly, blue-collar side of New York's Italian mafia is explored in this crime biopic of wiseguy Henry Hill. As he makes his way from strapping young petty criminal, to big-time thief, to middle-aged cocaine addict and dealer, the film explores in detail the rules and traditions of organized crime.",
        genres: {
            genreName: "Crime Drama",
            description:
                "Crime Drama is a sub-genre of drama that focuses on crimes, the criminals that commit them and the police that catch them. There are many formats of Crime drama such as detective, forensic/medical, procedural etc…",
        },
        directors: {
            directorName: "Martin Scorsese",
            bio: "American filmmaker known for his harsh, often violent depictions of American culture. From the 1970s Scorsese created an ambitious body of work that made him one of the most important filmmakers of the late 20th and early 21st centuries.",
            birthyear: "1942",
            deathyear: "N/A",
        },
        imageUrl: "https://images.app.goo.gl/Jx5ymfdFqh7rP6U67",
        year: "1990",
        featured: "Yes",
    },
    {
        title: "Snatch",
        description:
            "The story follows a group of gangsters, thieves, petty criminals, and smugglers who cross paths in the pursuit of a stolen diamond. The film features an impressive ensemble cast that includes Jason Statham, Dennis Farina, Vinnie Jones, and Brad Pitt; who all give great performances (especially Pitt).",
        genres: {
            genreName: "Heist Comedy",
            description:
                "The heist film or caper film is a subgenre of crime film focused on the planning, execution, and aftermath of a significant robbery.",
        },
        directors: {
            directorName: "Guy Ritchie",
            bio: "Born in Hatfield, Hertfordshire, UK. After watching Butch Cassidy and the Sundance Kid (1969) as a child, Guy realized that what he wanted to do was make films. He never attended film school, saying that the work of film school graduates was boring and unwatchable.",
            birthyear: "1968",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/Snatch_(film)#/media/File:Snatch_ver4.jpg",
        year: "2001",
        featured: "Yes",
    },
    {
        title: "The Dark Knight",
        description:
            "The plot follows the vigilante Batman, police lieutenant James Gordon, and district attorney Harvey Dent, who form an alliance to dismantle organized crime in Gotham City. Their efforts are derailed by the Joker, an anarchistic mastermind who seeks to test how far Batman will go to save the city from chaos.",
        genres: {
            genreName: "Action",
            description:
                "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
        },
        directors: {
            directorName: "Christopher Nolan",
            bio: "Christopher Nolan is British film director and writer acclaimed for his noirish visual aesthetic and unconventional, often highly conceptual narratives. Nolan was raised by an American mother and a British father, and his family spent time in both Chicago and London.",
            birthyear: "1970",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/The_Dark_Knight#/media/File:The_Dark_Knight_(2008_film).jpg",
        year: "2008",
        featured: "Yes",
    },
    {
        title: "Pulp Fiction",
        description:
            "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        genres: {
            genreName: "Crime Film",
            description:
                "Crime films, in the broadest sense, is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection.",
        },
        directors: {
            directorName: "Quentin Tarantino",
            bio: "Quentin Tarantino, in full Quentin Jerome Tarantino, (born March 27, 1963, Knoxville, Tennessee, U.S.), American director and screenwriter whose films are noted for their stylized violence, razor-sharp dialogue, and fascination with film and pop culture.",
            birthyear: "1963",
            deathyear: "N/A",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/Pulp_Fiction#/media/File:Pulp_Fiction_(1994)_poster.jpg",
        year: "1994",
        featured: "Yes",
    },
    {
        title: "Amadeus",
        description:
            "The life, success and troubles of Wolfgang Amadeus Mozart, as told by Antonio Salieri, the contemporaneous composer who was deeply jealous of Mozart's talent and claimed to have murdered him.",
        genres: {
            genreName: "Period Biographical Drama",
            description:
                "A historical period drama is a work of art set in, or reminiscent of, an earlier time period. That time period may be general, like the 18th century, our centered around a specific date, and may span multiple eras.",
        },
        directors: {
            directorName: "Miloš Forman",
            bio: "Miloš Forman, (born February 18, in Čáslav, Czechoslovakia [now in the Czech Republic]—died April 13, 2018, Danbury, Connecticut, U.S.), Czech-born New Wave filmmaker who was known primarily for the distinctively American movies that he made after his immigration to the United States.",
            birthyear: "1932",
            deathyear: "2018",
        },
        imageUrl:
            "https://en.wikipedia.org/wiki/Amadeus_(film)#/media/File:Amadeusmov.jpg",
        year: "1984",
        featured: "Yes",
    },
];

let users = [
    {
        id: "1",
        username: "bryantortega",
        email: "kalicorose@gmail.com",
        favoriteMovies: ["Goodfellas", "The Dark Knight"],
    },
    {
        id: "2",
        username: "sebastinkolman",
        email: "sebastin@fakemail.com",
        favoriteMovies: ["Snatch", "The Godfather"],
    },
];

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get("/topMovies", (req, res) => {
    res.json(topMovies);
});

app.get("/topMovies/:title", (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.title === title);

    if (movie) {
        return res.status(200).json(movie);
    } else {
        res.status(400).send("No such movie");
    }
});
//READ genre by name
app.get("/topMovies/genres/:genreName", (req, res) => {
    const { genreName } = req.params;
    const genre = topMovies.find(
        movie => movie.genres.genreName === genreName
    ).genres;

    if (genre) {
        return res.status(200).json(genre);
    } else {
        res.status(400).send("No such genre");
    }
});
//READ director by name
app.get("/topMovies/directors/:directorName", (req, res) => {
    const { directorName } = req.params;
    const director = topMovies.find(
        movie => movie.directors.directorName === directorName
    ).directors;

    if (director) {
        return res.status(200).json(director);
    } else {
        res.status(400).send("No such director");
    }
});
//CREATE new User
app.post("/users", (req, res) => {
    const newUser = req.body;

    if (!newUser.username) {
        const message = "Missing username in request body";
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

app.put("/users/:username", (req, res) => {
    res.json(
        "Successful GET request returning the information for the desired director."
    );
});

app.delete("/users/:id", (req, res) => {
    let student = students.find(student => {
        return student.id === req.params.id;
    });

    if (student) {
        students = students.filter(obj => {
            return obj.id !== req.params.id;
        });
        res.status(201).send("Student " + req.params.id + " was deleted.");
    }
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
