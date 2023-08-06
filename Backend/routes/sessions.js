const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessions");

/* Rutas para la consulta de analistas */
router.post("/", controller.startSession);
router.get("/", controller.sessions);
router.put("/", controller.closeSession);

module.exports = router;
