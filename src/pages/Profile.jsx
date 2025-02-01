import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);

  const { currentUser, setCurrentUser } = useContext(AuthContext); 
  const cat = useLocation().search;
  const navigate = useNavigate();

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  useEffect(() => {
    setNewUsername(currentUser.username);
    setNewEmail(currentUser.email);
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts`);
        const userPosts = res.data.filter((post) => post.uid === currentUser.id);
        setNumOfPosts(userPosts.length);
        setPosts(userPosts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [cat, currentUser.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData);
      return res.data; // Backend returns the filename
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      let imgUrl = currentUser.img; 
      if (file) {
        imgUrl = await upload(); 
      }

      const res = await axios.put(
        "/api/users/update",
        {
          username: newUsername,
          email: newEmail,
          img: imgUrl,
        },
        { withCredentials: true }
      );

      setCurrentUser(res.data); 
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("/api/users/delete", { withCredentials: true });
      setCurrentUser(null); 
      navigate("/"); 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile">
      <div className="user">
        <div className="user-img">
          <img
            src={
              selectedImage || `http://localhost:5173/upload/${currentUser.img}`
            }
            alt="Profile"
          />
          {isEditing && (
            <div id="upload-container">
              <input type="file" onChange={handleImageChange} />
            </div>
          )}
        </div>
        <div className="user-info">
          {isEditing ? (
            <>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </>
          ) : (
            <>
              <p>Username: {currentUser.username}</p>
              <p>Email: {currentUser.email}</p>
            </>
          )}
          <p>Number of posts: {numOfPosts}</p>
        </div>
        <div className="user-buttons">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
          <button onClick={handleDelete}>Delete Account</button>
        </div>
      </div>
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img
                src={`http://localhost:5173/upload/${post.img}`}
                alt={post.title}
              />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.description)}</p>
              <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;