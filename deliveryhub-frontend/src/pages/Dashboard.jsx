import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Dashboard = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    }
    if (!user) return null;

    return (<div>
        <h2>Welcome, {user.fullName} </h2>
        <p>Role: {user.role}</p>
        {user.role === "Customer" && (
            <div>
                <h3>Customer Dashboard</h3>
                <p>📦 Create new delivery request</p>
                <p>🧭 Track your deliveries</p>
                </div>
        )}

        {user.role === "TRANSPORTER" && (
            <div>
                <h3>Transporter Dashboard</h3>
                <p>🚚 View assigned deliveries</p>
                <p>📅 Update delivery status</p>
            </div>  
        )}
        
        {user.role === "ADMIN" && (
            <div>
                <h3>Admin Dashboard</h3>
                <p>📊 View delivery statistics</p>
                <p>✅ Approve transporters</p>
            </div>
        )}
               <button onClick={handleLogout}>Logout</button>
            </div>
           );
};

export default Dashboard;
