const { connectionDataBase: conn } = require("../configDatabase");

// GET
exports.postTrace = async (req, res) => {
  try {
    console.log(req.body.json);
    let { pregunta, respuesta, name, id_user, id_session } = JSON.parse(
      req.body.json || "{}"
    );
    const connection = await conn;
    const [result] = await connection.query(
      `INSERT INTO ${process.env.BD_NAME}.test (user_id,name,question,answer,timestamp) 
      VALUES (${id_user}, "${name}","${pregunta}","${respuesta}",now())`
    );

    res.json("ok");
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.statsVerb = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT verb,count(*) as cantidad FROM ${process.env.BD_NAME}.traces where session_id=${id} group by verb;`
    );

    res.json(traces);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.statsActor = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT actor,count(*) as cantidad FROM ${process.env.BD_NAME}.traces where session_id=${id} group by actor order by cantidad desc;`
    );

    res.json(traces);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.traces = async (req, res) => {
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
