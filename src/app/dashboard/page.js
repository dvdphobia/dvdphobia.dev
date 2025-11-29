export default function Dashboard() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome to the Admin Dashboard</h1>
      <p>This page is protected — you can only see it after logging in.</p>
      <form action="/api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
