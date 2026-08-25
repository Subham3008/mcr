const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome {user?.name}</h2>

      <p>{user?.email}</p>
    </div>
  );
};

export default Dashboard;
