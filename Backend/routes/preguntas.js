const express = require("express");
const router = express.Router();
const controller = require("../controllers/questions");

/* Rutas para la consulta de analistas */
router.post("/", controller.postTrace);
router.get("/", controller.traces);
router.get("/stats/verb/:id", controller.statsVerb);
router.get("/stats/actor/:id", controller.statsActor);

module.exports = router;
