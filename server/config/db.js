const sql = require("mssql/msnodesqlv8");

const config = {
  server: "localhost",
  database: "GraduateDB",
  user: "sa",
  password: "your_password",
  driver: "msnodesqlv8",
};

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
  return pool;
});
