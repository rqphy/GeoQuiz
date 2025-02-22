## The Idea

I’ve never been good at geography. Over the last few months, my friends and I have been learning about countries and their capitals. So, let’s create a game where we can all compete and learn faster! Note that for now, the game will be available only in French.

[Live](geoquiz.raphael-ferreira.com)

![Screenshot of the homepage](docs/home_geoquiz.png)

## Features

### Quiz

![Screenshot of the Quiz](docs/quiz_geoquiz.png)

The main part of the game will be the quiz. We’ll include two types of questions: the user will either need to find the country or the capital. Players will be able to create their own quiz by selecting specific continents and the number of rounds. We’ll create a script that:

- Retrieves a country ID from the pool of selected continents.
- Randomly selects a question type (from the two mentioned earlier).

Each time a player provides a correct answer, we’ll update the scoreboard and execute the script to generate a new question and get to the next round.

The data will come from JSON files. For now, the game will be in French.

### Room System

![Screenshot of the lobby](docs/lobby_geoquiz.png)

Recently, I’ve been experimenting with web sockets. Let’s create a room system so users can play with their friends. I plan to use Node.js and experiment with [Socket.io](http://socket.io/), an event-driven library for real-time web applications.

Each room will include:

- A `users` array to track all players and their scores.
- A `creatorID` to identify the admin.
- A `round` counter.
- A `roundLimit` to determine the total number of rounds.
- A `countriesList` to manage the pool of countries for the game.

### Wrong Answers

When a player gives a wrong answer, an event will be emitted to the other players. This wrong answer will be saved in a `useState` with an ID, the content, and coordinates to display it in the background. These coordinates will be generated using a small script. We’ll add a `setTimeout` to gradually fade out the wrong answer and remove it from the `useState` afterward.
