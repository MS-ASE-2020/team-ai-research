module.exports = {
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: {
    "aws-sdk": "aws-sdk",
    pg: "pg",
    "pg-query-stream": "pg-query-stream",
    mssql: "mssql",
    "mssql/lib/base": "mssql/lib/base",
    "mssql/package.json": "mssql/package.json",
    mysql: "mysql",
    mysql2: "mysql2",
    oracle: "oracle",
    oracledb: "oracledb",
    sqlite3: "sqlite3",
    tedious: "tedious",
  },
};