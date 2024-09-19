import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString()

  let queryVersion = await database.query('SELECT version()');
  const postgresVersion = queryVersion.rows[0].version;

  let queryMaximumConnections = await database.query('SHOW max_connections')
  const maximumConnections = queryMaximumConnections.rows[0].max_connections;

  let queryUsedConnections = await database.query(`SELECT * FROM pg_stat_activity WHERE datname = 'local_db';`)
  const usedConnections = queryUsedConnections.rows;

  response.status(200).json({
    updated_at: updatedAt,
    postgres_version: postgresVersion,
    maximum_connections: maximumConnections,
    used_connections: usedConnections,
  });
}

export default status;