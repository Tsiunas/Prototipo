const { connectionDataBase: conn } = require("../configDatabase");

// GET
/* The `exports.postTrace` function is a controller function that handles the logic for creating a new
trace in the database. It is called when a POST request is made to the corresponding route. */
exports.postTrace = async (req, res) => {
  try {
    console.log(req.body.json);
    let { actor, verb, objeto, resultado, id_user, id_session } = JSON.parse(
      req.body.json || "{}"
    );
    const connection = await conn;
    // Si id_session es -1, obtener el último ID de sesión no finalizada
    if (id_session === "-1") {
      const [lastSession] = await connection.query(
        `SELECT idsession FROM ${process.env.BD_NAME}.sessions WHERE final IS NULL ORDER BY idsession DESC LIMIT 1`
      );

      id_session = lastSession[0]?.idsession;
    }

    // Si id_user es -1, crear un nuevo usuario y obtener su ID
    if (id_user === "-1") {
      // Si id_session aún es -1, obtener el último ID de sesión no finalizada
      if (id_session === "-1") {
        const [lastSession] = await connection.query(
          `SELECT idsession FROM ${process.env.BD_NAME}.sessions WHERE final IS NULL ORDER BY idsession DESC LIMIT 1`
        );
        id_session = lastSession[0]?.idsession;
      }

      const [result] = await connection.query(
        `INSERT INTO ${process.env.BD_NAME}.users (name, session_id,timestamp) VALUES ('${actor}', ${id_session},now())`
      );
      id_user = result.insertId;
    }

    if (verb === "wrote") {
      const [result] = await connection.query(
        `UPDATE  ${process.env.BD_NAME}.users SET name = '${resultado}' where user_id=${id_user}`
      );
    } else {
      let [type, target, success] = resultado.split("|");
      const [traces] = await connection.query(
        `INSERT INTO ${
          process.env.BD_NAME
        }.traces (actor, verb, object, result, user_id, session_id, object_type,target,success)
        VALUES
        ('${actor}', '${verb}', '${objeto}', '${resultado}', ${id_user}, ${id_session}, '${type}', '${target}', ${
          success === "fallo" ? 0 : 1
        });`
      );
    }

    res.json(id_session + "|" + id_user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
/* The `exports.statsVerb` function is a controller function that handles the logic for retrieving
statistics based on the verb used in the traces. It is called when a GET request is made to the
corresponding route. */
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
/* The `exports.statsActor` function is a controller function that handles the logic for retrieving
statistics based on the actor (user) in the traces. It is called when a GET request is made to the
corresponding route. */
exports.statsActor = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT u.name as actor ,count(*) as cantidad FROM ${process.env.BD_NAME}.traces t join ${process.env.BD_NAME}.users u on t.user_id=u.user_id  where u.name not in ('user','game') and t.session_id=${id}  group by u.name order by cantidad desc;`
    );

    res.json(traces);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

// GET
/* The `exports.traces` function is a controller function that handles the logic for retrieving all the
traces from the database. It is called when a GET request is made to the corresponding route. */
exports.traces = async (req, res) => {
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT * FROM ${process.env.BD_NAME}.traces t join ${process.env.BD_NAME}.users u on t.user_id=u.user_id where u.name not in ('user','game') order by t.timestamp desc`
    );

    res.json(traces);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};
