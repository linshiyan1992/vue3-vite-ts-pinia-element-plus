import jsonServer from "json-server";
import axios from "axios";

const { bodyParser } = jsonServer;

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Default middlewares
server.use(middlewares);

//custom routes

server.use(bodyParser);
server.post("/users/register", (req, res, next) => {
  const { email } = req.body;
  axios
    .get(`http://localhost:10086/profiles?email=${email}`)
    .then((response) => {
      if (response.data.length > 0) {
        res.status(400).json({ msg: "Email has already been used!" });
      } else {
        axios
          .post("http://localhost:10086/profiles", req.body)
          .then((response) => {
            res.json(response.data);
          });
      }
    });
});

// Default Router
server.use(router);
server.use((err, req, res, next) => {
  res.status(400).send(err.message);
});
server.listen(10086, () => {
  console.log("JSON SERVER is running");
});
