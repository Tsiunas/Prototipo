const dns = require("dns");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Crear el servidor
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
//Habilitar cors
app.use(cors());

//Permitir leer datos que el usuario coloque
app.use(express.json({ extended: true }));

//importar rutas
app.use("/api/model", require("./routes/model"));
app.use("/api/traces", require("./routes/traces"));
app.use("/api/preguntas", require("./routes/preguntas"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/report", require("./routes/report"));

//Puerto de la app y escucha
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

const cron = require("node-cron");
const { runModel } = require("./controllers/model");

cron.schedule("*/1 * * * *", async () => {
  console.log("Ejecutando la función runModel...");
  await runModel();
});
