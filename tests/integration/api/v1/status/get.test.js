test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.postgres_version).toBe('PostgreSQL 16.0 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 12.2.1_git20220924-r10) 12.2.1 20220924, 64-bit');
  
  const parsedMaximumConnections = parseInt(responseBody.maximum_connections);
  expect(parsedMaximumConnections).toBeGreaterThan(1);

  const usedConnectionsQuantity = responseBody.used_connections.length;
  expect(usedConnectionsQuantity).toBeGreaterThan(0);
  
})