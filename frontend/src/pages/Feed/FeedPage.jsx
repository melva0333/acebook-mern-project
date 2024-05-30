import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import SubmitPost from "../../components/SubmitPost";

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  console.log("this is posts:",posts)
  return (
    <>
      <SubmitPost token={token}/>
      <h2>Posts</h2> 
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
          
        ))}
      </div>
    </>
  );
};
