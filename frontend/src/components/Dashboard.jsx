import { useState } from "react";

const userTableData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg?height=50&width=50",
  },
];

const adminTableData = [
  { id: 1, email: "admin1@example.com", password: "********" },
  { id: 2, email: "admin2@example.com", password: "********" },
];

const imagesTableData = [
  { id: 1, name: "meme1.jpeg", img: "displayImg", tag: "meme" },
  { id: 2, name: "funnycats.jpeg", img: "displayImg2", tag: "animals" },
];

export default function Dashboard() {
  const [view, setView] = useState("user");
  const [showNewAdminForm, setShowNewAdminForm] = useState(false);
  const [showNewImageForm, setShowNewImageForm] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTag, setSelectedImageTag] = useState(null);

  const handleCreateNewAdmin = (e) => {
    e.preventDefault();
    // Here you would typically handle creating a new admin
    console.log("New admin created:", {
      email: newAdminEmail,
      password: newAdminPassword,
    });
    setNewAdminEmail("");
    setNewAdminPassword("");
    setShowNewAdminForm(false);
  };

  const handleCreateNewImages = (e) => {
    e.preventDefault();
    // function for inserting image in S3 bucket
  };
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="view-selector">
        <button
          className={view === "user" ? "active" : ""}
          onClick={() => setView("user")}
        >
          User View
        </button>
        <button
          className={view === "admin" ? "active" : ""}
          onClick={() => setView("admin")}
        >
          Admin View
        </button>
        <button
          className={view === "images" ? "active" : ""}
          onClick={() => setView("images")}
        >
          Admin View
        </button>
      </div>

      {view === "user" && (
        <div className="table-container">
          <h2>User Table</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {userTableData.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <img
                      src={user.image}
                      alt={user.name}
                      width="50"
                      height="50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "admin" && (
        <div className="table-container">
          <div className="admin-header">
            <h2>Admin Table</h2>
            <button onClick={() => setShowNewAdminForm(true)}>
              Create New Admin
            </button>
          </div>
          {showNewAdminForm && (
            <form onSubmit={handleCreateNewAdmin} className="new-admin-form">
              <input
                type="email"
                placeholder="Email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                required
              />
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowNewAdminForm(false)}>
                Cancel
              </button>
            </form>
          )}
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {adminTableData.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.email}</td>
                  <td>{admin.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === "images" && (
        <div className="table-container">
          <div className="admin-header">
            <h2>Images Table</h2>
            <button onClick={() => setShowNewImageForm(true)}>
              Add New Images
            </button>
          </div>
          {showNewImageForm && (
            <form onSubmit={handleCreateNewImages} className="new-admin-form">
              <input
                type="file"
                value={selectedImage}
                onChange={(e) => setSelectedImage(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter tag for image"
                value={selectedImageTag}
                onChange={(e) => setSelectedImageTag(e.target.value)}
                required
              />
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowNewImageForm(false)}>
                Cancel
              </button>
            </form>
          )}
          <table>
            <thead>
              <tr>
                <th>Image Name</th>
                <th>Image</th>
                <th>Image Tag</th>
              </tr>
            </thead>
            <tbody>
              {imagesTableData.map((img) => (
                <tr key={img.id}>
                  <td>{img.img}</td>
                  <td>{img.name}</td>
                  <td>{img.tag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .dashboard {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          text-align: center;
          color: #333;
        }

        .view-selector {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }

        .view-selector button {
          padding: 10px 20px;
          margin: 0 10px;
          border: none;
          background-color: #f0f0f0;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .view-selector button.active {
          background-color: #007bff;
          color: white;
        }

        .table-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        h2 {
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
        }

        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #f8f9fa;
        }

        .admin-header button {
          padding: 8px 16px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .admin-header button:hover {
          background-color: #218838;
        }

        .new-admin-form {
          display: flex;
          gap: 10px;
          padding: 20px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }

        .new-admin-form input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }

        .new-admin-form button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .new-admin-form button[type="submit"] {
          background-color: #007bff;
          color: white;
        }

        .new-admin-form button[type="submit"]:hover {
          background-color: #0056b3;
        }

        .new-admin-form button[type="button"] {
          background-color: #6c757d;
          color: white;
        }

        .new-admin-form button[type="button"]:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  );
}
