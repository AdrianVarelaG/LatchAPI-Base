import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoUtil from "./utils/mongoUtil";
import Keycloak from "keycloak-connect";
import customers from "./routes/clients";

const app = express();

var keycloak = new Keycloak({});
//app.use(keycloak.middleware());

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    req.header("Access-Control-Allow-Method", "POST, PUT, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/customers", customers);

//app.use("/organizations", /*keycloak.protect(),*/ organizationsRoutes);

/*
app.use("/certificate", keycloak.protect(), certificate);
app.use("/catalogs", keycloak.protect(), catalogs);
app.use("/printed-representation", keycloak.protect(), printedRepresentation);
*/

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const port = process.env.PORT || 4001;

mongoUtil.connectToServer(() => {
  app.listen(port, () => {
    console.log(`Node.js app is listening at http://localhost:${port}`);
  });
});

/*MongoClient.connect(config.database.url)
  .then(client => {
    app.locals.db = client.db("latch-admin");
    
  })
  .catch(err => console.log(err));
*/
