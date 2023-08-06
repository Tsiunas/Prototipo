const { connectionDataBase: conn } = require("../configDatabase");
const { exec } = require("child_process");
const fs = require("fs");

/* The `exports.getModelResult` function is a controller function that handles a GET request to
retrieve model results. */
exports.getModelResult = async (req, res) => {
  try {
    const jsonFilePath = "./result.json"; // Ruta del archivo JSON

    // Verificar si el archivo JSON existe
    if (!fs.existsSync(jsonFilePath)) {
      return res.status(404).json("No se encontró el archivo JSON.");
    }

    // Leer el contenido del archivo JSON
    const jsonData = fs.readFileSync(jsonFilePath, "utf-8");

    // Parsear el contenido JSON
    const results = JSON.parse(jsonData);
    const connection = await conn;
    const [users] = await connection.query(
      `SELECT * FROM ${process.env.BD_NAME}.users`
    );
    user_list = results.user_list.map((r) => {
      let user = users.filter((u) => u.user_id === r.id)[0];
      return { ...r, name: user.name };
    });

    res.json({ ...results, user_list: user_list });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error: " + error);
  }
};
/* The `exports.postModelResult` function is a controller function that handles a POST request to save
model results. */

exports.postModelResult = async (req, res) => {
  try {
    console.log(req.body);
    let { user_list } = req.body;

    // Guardar req.body en result.json
    fs.writeFileSync("result.json", JSON.stringify(req.body));

    const columns = Object.keys(user_list[0]); // Obtiene los nombres de las columnas del primer registro

    const csvWriter = createCsvWriter({
      path: "./results.csv", // Ruta del archivo CSV
      header: columns.map((column) => ({ id: column, title: column })),
    });

    await csvWriter.writeRecords(user_list);
    res.json("ok");
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error" + error);
  }
};

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
/* The `exports.runModel` function is a controller function that runs a model. Here's what it does: */

exports.runModel = async () => {
  try {
    const connection = await conn;
    const [traces] = await connection.query(
      `SELECT idtraces,actor,verb,object,t.session_id,t.user_id, t.success,t.target,t.object_type,t.timestamp
       FROM ${process.env.BD_NAME}.traces t join ${process.env.BD_NAME}.users u on t.user_id=u.user_id 
       where u.name not in ('user','game') 
       and t.session_id = (SELECT MAX(idsession) FROM ${process.env.BD_NAME}.sessions)
        order by t.timestamp desc`
    );

    if (traces.length === 0) {
      console.log("No hay datos para guardar en el archivo CSV.");
      return;
    }

    const columns = Object.keys(traces[0]); // Obtiene los nombres de las columnas del primer registro

    const csvWriter = createCsvWriter({
      path: "./traces.csv", // Ruta del archivo CSV
      header: columns.map((column) => ({ id: column, title: column })),
    });

    await csvWriter.writeRecords(traces);
    console.log("Los resultados se han guardado en el archivo CSV.");
    // Ruta y comando para ejecutar el script de Python
    const pythonScript = "./model-clustering.py";
    const pythonCommand = `python ${pythonScript}`;

    // Ejecutar el script de Python
    exec(pythonCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el script de Python: ${error}`);
        return;
      }

      // Procesar la salida estándar (stdout) y errores (stderr) si es necesario
      console.log("script de Python ejecutado correctamente");
    });
  } catch (error) {
    console.log(error);
  }
};
