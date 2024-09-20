import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  let queryVersion = await database.query("SHOW server_version;");
  const postgresVersion = parseInt(queryVersion.rows[0].server_version);

  let queryMaximumConnections = await database.query("SHOW max_connections;");
  const maximumConnections = parseInt(
    queryMaximumConnections.rows[0].max_connections,
  );

  let queryUsedConnections = await database.query(
    `SELECT * FROM pg_stat_activity WHERE datname = 'local_db';`,
  );
  const usedConnections = queryUsedConnections.rows.length;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: maximumConnections,
        opened_connections: usedConnections,
      },
    },
  });
}

export default status;
