import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const userTableData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg?height=50&width=50",
  },
];

export default function Dashboard() {
  const [view, setView] = useState("user");
  const [showNewAdminForm, setShowNewAdminForm] = useState(false);
  const [showNewImageForm, setShowNewImageForm] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageTag, setSelectedImageTag] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [allImages, setAllImages] = useState(false);

  const handleCreateNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/create-new-admin", {
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        role: "admin",
      });
      setAdmins(res.data);
    } catch (err) {
      console.log("Error creating new admin", err);
    }
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminPassword("");
    setShowNewAdminForm(false);
  };

  const handleCancelImagesForm = () => {
    setShowNewImageForm(false);
    setSelectedImage("");
    setSelectedImageTag("");
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
    }
  };

  const handleCreateNewImages = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    try {
      const fileName = selectedImage.name;
      const fileType = selectedImage.type;
      const res = await axios.get(
        "http://localhost:3000/generate-presigned-url",
        {
          params: {
            fileName,
            fileType,
          },
        }
      );

      const { url } = res.data;

      // Use the pre-signed URL to directly upload the file to S3
      await axios.put(url, selectedImage, {
        headers: {
          "Content-Type": fileType,
          "x-amz-acl": "public-read",
        },
      });

      const publicUrl = `https://meme-generator-new.s3.ap-south-1.amazonaws.com/${fileName}`;

      // Upload the images in the db
      await axios.post("http://localhost:3000/upload-image", {
        imgName: fileName,
        tag: selectedImageTag,
        imgLink: publicUrl,
      });

      setAllImages(true);
      setShowNewImageForm(false);
      setSelectedImage("");
      setSelectedImageTag("");
    } catch (err) {
      console.error("Error uploading image: ", err);
    }
  };

  const handleDeleteImage = async (id) => {
    const response = await axios.delete(`http://localhost:3000/delete-image/${id}`);
    console.log(response.data);
    setAllImages(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-images");
        const adminData = await axios.get(
          "http://localhost:3000/get-all-admins"
        );
        setAdmins(adminData.data);
        setDisplayImages(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [allImages]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="view-selector">
        <button
          className={view === "user" ? "active" : ""}
          onClick={() => setView("user")}
        >
          User Data
        </button>
        <button
          className={view === "admin" ? "active" : ""}
          onClick={() => setView("admin")}
        >
          All Users Login
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
          <h2>User Data</h2>
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
            <h2>All Logins</h2>
            <button onClick={() => setShowNewAdminForm(true)}>
              Create New Admin
            </button>
          </div>
          {showNewAdminForm && (
            <form onSubmit={handleCreateNewAdmin} className="new-admin-form">
              <input
                type="text"
                placeholder="Name"
                value={newAdminName}
                onChange={(e) => {
                  setNewAdminName(e.target.value);
                }}
                required
              />
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
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
                accept="image/*"
                onChange={handleFileChange}
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
              <button type="button" onClick={() => handleCancelImagesForm}>
                Cancel
              </button>
            </form>
          )}
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Image Name</th>
                <th>Image Tag</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {displayImages.map((img) => (
                <tr key={img.id}>
                  <td>
                    <img src={img.imgLink} alt={img.imgName} width="100" />
                  </td>
                  <td>{img.imgName}</td>
                  <td>{img.tag}</td>
                  <td>
                    {" "}
                    <Trash2
                      className="icon"
                      onClick={() => handleDeleteImage(img.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
      .icon{
       color: #ff4136;
       cursor: pointer;
      }

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
