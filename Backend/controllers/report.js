const { connectionDataBase: conn } = require("../configDatabase");
// GET
exports.report = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT * FROM ${process.env.BD_NAME}.traces where session_id=${id} order by timestamp desc`
    );
    const [statsVerb] = await connection.query(
      `SELECT verb,count(*) as cantidad FROM ${process.env.BD_NAME}.traces where session_id=${id} group by verb;`
    );

    const [statsActor] = await connection.query(
      `SELECT actor,count(*) as cantidad FROM ${process.env.BD_NAME}.traces where session_id=${id} group by actor order by cantidad desc;`
    );
    res.json({
      Trazas: traces,
      "Estadisticas por verbo": statsVerb,
      "Estadisticas por actor": statsActor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
exports.alerts = async (req, res) => {
  try {
    let alertsList = [];
    const connection = await conn;
    const [cond1] = await connection.query(
      `SELECT *
      FROM ${process.env.BD_NAME}.traces t join ${process.env.BD_NAME}.users u on t.user_id=u.user_id where u.name not in ('user','game')
      and t.object = 'item'
        AND verb = 'dragged'
        AND t.object_type = 'tsiuna'
        AND t.success != 0
        AND t.timestamp >= NOW() - INTERVAL 30 SECOND`
    );
    if (cond1.length > 0) {
      for (let index = 0; index < cond1.length; index++) {
        alertsList.push({
          message: `${
            cond1[index].actor
          } se equivoco al dar una tsiuna a ${cond1[index].result
            .split("|")[1]
            .replace("PNJ_", "")}`,
        });
      }
    }

    const [cond2] = await connection.query(
      `SELECT t.user_id,u.name, TIMESTAMPDIFF(MINUTE, MAX(t.timestamp), NOW()) AS minutos_sin_interaccion
      FROM ${process.env.BD_NAME}.traces t join ${process.env.BD_NAME}.users u on t.user_id=u.user_id where u.name not in ('user','game')
      and t.session_id = (SELECT MAX(idsession) FROM ${process.env.BD_NAME}.sessions)
      GROUP BY t.user_id
      HAVING minutos_sin_interaccion > 5 and minutos_sin_interaccion < 10;`
    );
    if (cond2.length > 0) {
      for (let index = 0; index < cond2.length; index++) {
        alertsList.push({
          message: `${
            cond2[index].name
          } lleva ${cond2[index].minutos_sin_interaccion} minutos de inactividad`,
        });
      }
    }
    const [cond3] = await connection.query(
      `SELECT t.user_id,t.actor, u.name, TIMESTAMPDIFF(MINUTE, MAX(t.timestamp), NOW()) AS minutos_sin_interaccion
      FROM ${process.env.BD_NAME}.traces t join ${process.env.BD_NAME}.users u on t.user_id=u.user_id where u.name not in ('user','game')
      AND t.session_id = (SELECT MAX(idsession) FROM ${process.env.BD_NAME}.sessions)
        AND t.object = 'item'
        AND t.object_type = 'tsiuna'
        AND t.verb = 'dragged'
        AND t.success != 0
      GROUP BY t.user_id,t.actor
      HAVING minutos_sin_interaccion > 5 and minutos_sin_interaccion < 10;`
    );
    if (cond3.length > 0) {
      for (let index = 0; index < cond3.length; index++) {
        alertsList.push({
          message: `${
            cond3[index].name
          } lleva ${cond3[index].minutos_sin_interaccion} minutos en los que no ha recibido una flama de la armonia`,
        });
      }
    }
    res.json(alertsList);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};
