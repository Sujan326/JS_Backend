// const express = require('express');
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is Ready");
});

// get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "Joke 1",
      content: "First Joke",
    },
    {
      id: 2,
      title: "Joke 2",
      content: "Second Joke",
    },
    {
      id: 3,
      title: "Joke 3",
      content: "Third Joke",
    },
    {
      id: 4,
      title: "Joke 4",
      content: "Fourth Joke",
    },
    {
      id: 5,
      title: "Joke 5",
      content: "Fifth Joke",
    },
  ];
  res.send(jokes)
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
