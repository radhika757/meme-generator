import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    console.log("Login submitted", { name, email });
    const result = axios.post("http://localhost:3000/login", { name, email });
    console.log(result);
    
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p className="description">Please enter your details to log in</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <p className="signup-link">
          Dont have an account? <a href="#">Sign up</a>
        </p>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
         
          font-family: Arial, sans-serif;
        }

        .login-box {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .description {
          text-align: center;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .input-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        input:focus {
          outline: none;
          border-color: #0072ff;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #0072ff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #005ae6;
        }

        .signup-link {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #666;
        }

        .signup-link a {
          color: #0072ff;
          text-decoration: none;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
