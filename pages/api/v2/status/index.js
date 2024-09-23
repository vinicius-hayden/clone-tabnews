import { Client } from "pg";

async function status(request, response) {
  const client = new Client({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
  });

  try {
    await client.connect();

    const updatedAt = new Date().toISOString();
    
    let queryVersion = await client.query("SHOW server_version;");
    const postgresVersion = parseInt(queryVersion.rows[0].server_version);

    let queryMaxConnections = await client.query("SHOW max_connections;");
    const maxConnections = parseInt(queryMaxConnections.rows[0].max_connections);

    let databaseName = process.env.POSTGRES_DB;

    const queryUsedConnections = await client.query({
      text: `SELECT COUNT(*)::int from pg_stat_activity WHERE datname = $1`,
      values: [databaseName]
    })
    
    const openedConnections = queryUsedConnections.rows[0].count;


    response.status(200).json({
      updated_at : updatedAt,
      dependencies: {
        database: {
          version: postgresVersion,
          max_connections: maxConnections,
          opened_connections: openedConnections
        }
      }
    });
  } catch (error) {
    console.log('Database query error: ', error);
    response.status(500).json({
      error: 'Internal server error'
    })
  } finally {
    client.end();
  }

}

export default status;