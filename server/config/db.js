const sql = require("mssql/msnodesqlv8");

const config = {
  driver: "msnodesqlv8",
  connectionString:
    "Driver={ODBC Driver 18 for SQL Server};Server=SON1;Database=GraduationDB;Trusted_Connection=Yes;TrustServerCertificate=Yes;",
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("SQL Done");
    return pool;
  })
  .catch((err) => {
    console.error("Lỗi kết nối SQL Server:", err);
  });

module.exports = { sql, poolPromise };
