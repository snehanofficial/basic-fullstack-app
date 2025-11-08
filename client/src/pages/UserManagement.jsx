import React, { useEffect, useState } from "react";
import axios from "axios";
import '../assets/styles/UserManagement.css'
import { FaTrashCan, FaPencil } from "react-icons/fa6";

const API = ( import.meta.env.REACT_APP_API_URL || "http://localhost:3000");

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [visibleContainer, setVisibleContainer] = useState('addUser');
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    id: "",
  });

  // Get all users
  async function GetData() {
    try {
      const res = await axios.get(`${API}/list-users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error("GetData error:", err);
      alert("Failed to fetch users");
    }
  }

  // Add user
  async function AddUser(e) {
    e.preventDefault();
    try {
      const { name, email, password } = form;
      await axios.post(`${API}/add-users`, { name, email, password });
      setForm({ name: "", email: "", password: "", id: "" });
      await GetData();
      alert("User added");
    } catch (err) {
      console.error("AddUser error:", err);
      alert("Failed to add user");
    }
  }

  // Update entire user (name, email, password)
  async function UpdateUser(e) {
    e.preventDefault();
    try {
      const { id, name, email, password } = form;
      if (!id) return alert("Please provide user id to update");

      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (email) updatedFields.email = email;
      if (password) updatedFields.password = password;

      if (Object.keys(updatedFields).length === 0) {
        return alert("No new data to update");
      }

      await axios.put(`${API}/update-user/${id}`, updatedFields);
      setForm({ name: "", email: "", password: "", id: "" });
      await GetData();
      alert("User updated");
    } catch (err) {
      console.error("UpdateUser error:", err);
      alert("Failed to update user");
    }

    setVisibleContainer('addUser');
  }

  // Delete user
  async function DeleteUser(id) {
    try {
      if (!window.confirm("Delete this user?")) return;
      await axios.delete(`${API}/delete-user/${id}`);
      await GetData();
      alert("User deleted");
    } catch (err) {
      console.error("DeleteUser error:", err);
      alert("Failed to delete user");
    }
  }

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="app">
      <h2>User Management System</h2>

      
      {visibleContainer === 'addUser' && (
      <div className="form-container">
      <form className="form" onSubmit={AddUser}>
        <h3>Add User</h3>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        /> <br />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        /> <br />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        /> <br />
        <button className="add-btn" type="submit">Add</button>
      </form>
      </div>
      )}
      
      {visibleContainer === 'updateUser' && ( <div className="form-container update-form">
      <form className="form" onSubmit={UpdateUser}>
        <h3>Update User</h3>
        <input
          placeholder="ID to update"
          value={form.id}
          onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
          required
        /> <br />
        <input
          placeholder="New name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        /> <br />
        <input
          placeholder="New email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        /> <br />
        <input
          placeholder="New password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        /> <br />
        <button className="update-btn" type="submit">Update</button>
      </form>
      </div>
      )}

      <section className="users-list">
        <h3>All Users</h3>
        {users.length === 0 ? (
          <p>No users</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button
                      onClick={() => {
                        setForm({
                          id: String(u.id),
                          name: u.name,
                          email: u.email,
                          password: u.password,
                        });
                        setVisibleContainer('updateUser');
                      }
                      }
                    >
                      <FaPencil />
                    </button>
                    <button onClick={() => DeleteUser(u.id)}><FaTrashCan /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default UserManagement;