import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  let queryVersion = await database.query("SHOW server_version;");
  const postgresVersion = parseInt(queryVersion.rows[0].server_version);

  let queryMaxConnections = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(
    queryMaxConnections.rows[0].max_connections,
  );

  let queryUsedConnections = await database.query(
    `SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';`,
  );
  const openedConnections = queryUsedConnections.rows.length;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  });
}

export default status;
