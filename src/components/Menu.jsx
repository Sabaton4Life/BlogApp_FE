import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Menu = ({ cat }) => {

    const [posts, setPosts] = useState([]);

    const postId = location.pathname.split("/")[2]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/posts/?cat=${cat}`);
                const filteredPosts = res.data.filter(post => post.id !== parseInt(postId));
                setPosts(filteredPosts);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [cat,postId]);

    return (
        <div className='menu'>
            <h1>Other posts you may like:</h1>
            {posts.map(post => (
                <div className="post" key={post.id}>
                    <Link className="link" to={`/post/${post.id}`}>
                    <img src={`../upload/${post.img}`} alt="Image" />
                    <h2>{post.title}</h2>
                    </Link>
                </div>
            ))}

        </div>
    )
}

export default Menu
