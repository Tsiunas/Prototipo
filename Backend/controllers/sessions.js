const { connectionDataBase: conn } = require("../configDatabase");

// POST
exports.startSession = async (req, res) => {
  try {
    const connection = await conn;
    const [sessions] = await connection.query(
      `INSERT INTO ${process.env.BD_NAME}.sessions (inicio) VALUES (NOW())`
    );

    res.json(sessions);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};
// PUT
exports.closeSession = async (req, res) => {
  let { id_session } = req.body;
  try {
    const connection = await conn;
    const [sessions] = await connection.query(
      `UPDATE ${process.env.BD_NAME}.sessions SET FINAL =NOW() WHERE idsession=${id_session}`
    );

    res.json(sessions);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.sessions = async (req, res) => {
  try {
    const connection = await conn;
    const [sessions] = await connection.query(
      `SELECT
      s.idsession, s.inicio,
       s.final,
      COUNT(u.user_id) AS numero_usuarios,
      IFNULL(TIMESTAMPDIFF(SECOND, s.inicio, s.final), TIMESTAMPDIFF(SECOND, s.inicio, CURRENT_TIMESTAMP())) AS duracion_segundos
    FROM
      ${process.env.BD_NAME}.sessions s
    LEFT JOIN
      ${process.env.BD_NAME}.users u ON s.idsession = u.session_id
      
    GROUP BY
      s.idsession, s.inicio, s.final
    ORDER BY s.idsession DESC
    `
    );
    let f = sessions.map((s) => {
      return {
        ...s,
        inicio: s.inicio.toLocaleString() ?? null,
        final: s.final?.toLocaleString() ?? null,
      };
    });
    res.json(f);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.statsVerb = async (req, res) => {
  try {
    const connection = await conn;
    console.log(`SELECT verb,count(*) as cantidad FROM ${process.env.BD_NAME}.traces group by verb;`);
    const [traces] = await connection.query(
      `SELECT verb,count(*) as cantidad FROM ${process.env.BD_NAME}.traces group by verb;`
    );

    res.json(traces);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.statsActor = async (req, res) => {
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT actor,count(*) as cantidad FROM ${process.env.BD_NAME}.traces group by actor order by cantidad desc;`
    );

    res.json(traces);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.traces = async (req, res) => {
  console.log("Get traces");
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT * FROM ${process.env.BD_NAME}.traces order by timestamp desc`
    );

    res.json(traces);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};
