import React, { useContext, useEffect, useState } from 'react'
import editBtn from '../images/editBtn.png'
import deleteBtn from '../images/deleteBtn.png'
import Sebastian from '../images/Sebastian.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Menu from '../components/Menu'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../context/AuthContext'


const Single = () => {

  const [post, setPost] = useState({});

  const location = useLocation()
  const navigator = useNavigate()

  const postId = location.pathname.split("/")[2]
  const {currentUser} = useContext(AuthContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      navigator("/")
    } catch (err) {
      console.log(err);
    }
  }

  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    <div>
      <div className="single">
        <div className="content">
          <img className='post-image' src={`../upload/${post?.img}`} alt="" />
          <div className="user">
            {post.userImg && <img src={post.userImg} alt="profile pic" className='post-owner-image'/>}
            <div className="info">
              <span>{post.username}</span>
              <span>Posted {moment(post.date).fromNow()}</span>
            </div>
            {currentUser.username === post.username && <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
              <img src={editBtn} alt="Edit" />
              </Link>
              <img onClick={handleDelete} id='delete' src={deleteBtn} alt="Delete" />
            </div>}
          </div>
          <h1>
            {post.title}
          </h1>
          {getText(post.description)}
        </div>
        <div className="menu">
          <Menu cat={post.cat}/>
        </div>
      </div>
    </div>
  )
}

export default Single
