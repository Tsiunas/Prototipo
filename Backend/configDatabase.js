const mysql = require("mysql2/promise");
const BD_yeapGo = JSON.parse(process.env.CONECTION_BD);

let connectionDataBase;
try {
  /* Se conecta a la base de datos de YeapGo */
  connectionDataBase = mysql.createPool({
    ...BD_yeapGo,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
  });
} catch (error) {
  //console.error(error);
}

module.exports = { connectionDataBase };
