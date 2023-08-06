const express = require("express");
const router = express.Router();
const controller = require("../controllers/model");

/* Rutas para la consulta de analistas */
router.post("/", controller.postModelResult);
router.get("/", controller.getModelResult);

module.exports = router;
