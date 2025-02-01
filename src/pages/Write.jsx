import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const Write = () => {
  const state = useLocation().state
  const [title, setTitle] = useState(state?.title || '');
  const [value, setValue] = useState(state?.description || '');
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || '');

  const navigate = useNavigate()

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await axios.post("/api/upload", formData)
      return res.data
    } catch (err) {
      console.log(err)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      state
        ? await axios.put(`/api/posts/${state.id}`, {
            title,
            description: value,
            cat,
            img: file ? imgUrl : "",
          })
        : await axios.post(`/api/posts/`, {
            title,
            description: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          });
          navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='add'>
      <div className="content">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill className='editor' theme='snow' value={value} onChange={setValue} />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input style={{ display: "none" }} type="file" id="file" onChange={e => setFile(e.target.files[0])} />
          <label className='file' htmlFor="file">Upload Image</label>
          <div className="buttons">
            <button>Save as a draft</button>
            <button onClick={handleSubmit}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input type="radio" checked={cat === "Espresso"} name='cat' value='Espresso' id='Espresso' onChange={e => setCat(e.target.value)} />
            <label htmlFor="espresso">Espresso</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "Aeropress"} name='cat' value='Aeropress' id='Aeropress' onChange={e => setCat(e.target.value)} />
            <label htmlFor="aeropress">Aeropress</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "V60"} name='cat' value='V60' id='V60' onChange={e => setCat(e.target.value)} />
            <label htmlFor="v60">V60</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "Moka Pot"} name='cat' value='Moka Pot' id='Moka Pot' onChange={e => setCat(e.target.value)} />
            <label htmlFor="mokapot">Moka Pot</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "Cevze"} name='cat' value='Cevze' id='Cevze' onChange={e => setCat(e.target.value)} />
            <label htmlFor="cevze">Cevze</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Write
