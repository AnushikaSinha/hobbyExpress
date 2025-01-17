import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

/*app.get("/", (req, res) => {
  res.send("Hello Demo Express!");
});

app.get("/home", (req, res) => {
  res.send("Hello HOME Express!");
});

app.get("/about", (req, res) => {
  res.send("Hello ABOUT Express!");
});
*/

let hobby = [
  {
    id: 1,
    name: "Singing",
    level: "P2",
  },
  {
    id: 2,
    name: "Dancing",
    level: "P3",
  },
  {
    id: 3,
    name: "Drawing",
    level: "P1",
  },
];
let nextId = 1;

//Add hobbies
app.post("/hobbies", (req, res) => {
  logger.info("A post request was made")
  const { name, level } = req.body;
  const newHobby = { id: nextId++, name, level };
  hobby.push(newHobby);
  res.status(201).send(newHobby);
});

// Get Hobbies
app.get("/hobbies", (req, res) => {
  res.status(200).send(hobby);
});

//Get a hobby
app.get("/hobbies/:id", (req, res) => {
  const currentHobby = hobby.find((hob) => hob.id === parseInt(req.params.id));
  if (!currentHobby) {
    return res.status(404).send("Hobby Not Found");
  }
  res.status(200).send(currentHobby);
});

//Update a hobby
app.put("/hobbies/:id", (req, res) => {
  const currentHobby = hobby.find((hob) => hob.id === parseInt(req.params.id));
  if (!currentHobby) {
    return res.status(404).send("Hobby Not Found");
  }
  const { name, level } = req.body;
  currentHobby.name = name;
  currentHobby.level = level;
  res.status(200).send(currentHobby);
});

//Delete a hobby
app.delete("/hobbies/:id", (req, res) => {
  hobby.findIndex((hob) => hob.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("Hobby Not Found");
  }
  hobby.splice(index, 1);
  return res.status(200).send("Deleted");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}...`);
});
