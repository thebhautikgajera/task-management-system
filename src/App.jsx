  import { useContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Dashboard/AdminDashboard"
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "./context/AuthProvider";

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const authData = useContext(AuthContext);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.role);
      setLoggedInUser(parsedUser.data);
    }
  }, []);

  const handleLogin = (formEmail, formPassword) => {
    if (!formEmail || !formPassword) {
      toast.error("Please enter both email and password");
      return;
    }

    if (formEmail === "admin@gmail.com" && formPassword === "Admin@123") {
      setUser("admin");
      localStorage.setItem("loggedInUser", JSON.stringify({role: "admin"}));
      toast.success("Welcome Admin!");
      return;
    }

    if (!authData?.employees) {
      toast.error("Unable to verify credentials");
      return;
    }

    const employee = authData.employees.find(
      (e) => formEmail === e.email && formPassword === e.password
    );

    if (employee) {
      setUser("employee");
      setLoggedInUser(employee);
      localStorage.setItem("loggedInUser", JSON.stringify({
        role: "employee", 
        data: employee
      }));
      toast.success(`Welcome ${employee.firstName}!`);
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <>
      <ToastContainer />
      {!user && <Login handleLogin={handleLogin} />}
      {user === "admin" ? (
        <AdminDashboard />
      ) : user === "employee" ? (
        <EmployeeDashboard loggedInUser={loggedInUser} />
      ) : null}
    </>
  );
};

export default App;
