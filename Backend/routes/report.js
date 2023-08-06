const express = require("express");
const router = express.Router();
const controller = require("../controllers/report");

/* Rutas para la consulta de analistas */
router.get("/alerts",controller.alerts)
router.get("/:id", controller.report);


module.exports = router;
