import jsonServer from "json-server";
import axios from "axios";
import CryptoJS from "crypto-js";
import { faker } from "@faker-js/faker";

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const { bodyParser } = jsonServer;
const router = jsonServer.router("db.json");

// Default middlewares
server.use(middlewares);

server.use(bodyParser);

//custom routes

server.post("/users/register", (req, res, next) => {
  const { email } = req.body;
  axios
    .get(`http://localhost:10086/profiles?email=${email}`)
    .then((response) => {
      if (response.data.length > 0) {
        res.status(400).json({ msg: "Email has already been used!" });
      } else {
        let userData = {
          id: faker.database.mongodbObjectId(),
          ...req.body,
          password: CryptoJS.AES.encrypt(req.body.password, "hello").toString(),
          avatar: faker.internet.avatar(),
          date: new Date().toISOString(),
        };
        axios
          .post("http://localhost:10086/profiles", userData)
          .then((response) => {
            res.json(response.data);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Default Router
server.use(router);

server.use((err, req, res, next) => {
  res.status(400).json({ status: "Error", msg: `${err.message}` });
});
server.listen(10086, () => {
  console.log("JSON SERVER is running");
});
