import express from "express";
import 'dotenv/config'
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

let teaData = [];
let nextId = 1;

app.post("/teas", (req, res) => {
  // logger.info("A post request is made to add a tea")
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

app.get("/teas", (req, res) => {
  res.send(teaData).status(200);
});

app.get("/teas/:id", (req, res) => {
  const teaId = teaData.find((tea) => tea.id === parseInt(req.params.id));
  if (!teaId) {
    return res.status(404).send("Tea not Found");
  }
  res.send(teaId).status(200);
});

app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((tea) => tea.id === parseInt(req.params.id));
  if (!tea) {
    return res.send("Tea not Found").status(404);
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.send(tea).status(200);
});

app.delete("/teas/:id", (req, res) => {
  const index = teaData.findIndex((tea) => tea.id === parseInt(req.params.id));
  if (index === -1) {
    return res.send("Tea not Found").status(404);
  }

  teaData.splice(index, 1);
  return res.status(200).send("Tea Delete");
});

app.listen(port, () => {
  console.log("Server Started at port", port, "...");
});
