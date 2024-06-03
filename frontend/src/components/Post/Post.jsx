import "../../../css/post.css"
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import { formatDistanceToNow } from 'date-fns';
import { likePost } from '../../services/posts';
import { unlikePost } from '../../services/posts';
import SubmitComment from "../Comment/SubmitComment";
import Comment from "../Comment/Comment";
import { getAllComments } from "../../services/comments";



const Post = (props) => {
  console.log("this is the props:", props)
  const navigate = useNavigate(); 
  const token = props.token
  const postId = props.post._id
  const postTimestamp = props.post.createdAt
  const userId = localStorage.getItem("userId");
  const initialLikeCount = props.post.likes.length;
  const initialLikeStatus = props.post.likes.includes(userId)


  const [likeStatus, setLikeStatus] = useState(initialLikeStatus)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [commentsList, setCommentsList] = useState([]);



  function formatTimestamp(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
  
  const formattedTimestamp = formatTimestamp(postTimestamp);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAllComments(token)
        .then((data) => {
          setCommentsList(data.comments);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleLike = async () => {

    if (likeStatus == false) {
    setLikeCount(likeCount + 1);

    try {
      await likePost(token, postId);
      // navigate("/posts"); dont think this is needed?
  } catch (err) {
      console.error(err);
      // navigate("/posts");
      setLikeCount(likeCount); // Revert state change on error
  }
  } else if (likeStatus == true) {
    setLikeCount(likeCount - 1);
    try {
      await unlikePost(token, postId);
      // navigate("/posts");
  } catch (err) {
      console.error(err);
      // navigate("/posts");
      setLikeCount(likeCount); // Revert state change on error

  }}
  setLikeStatus(!likeStatus)}

  const handleCommentCreated = (newComment) => {
    setCommentsList((prevComments) => [newComment, ...prevComments]);
  };

  return <div key={postId} className="post">
    <h2>{props.post.username} - {formattedTimestamp}</h2>
    <article>{props.post.message}</article>
    <button onClick={ handleLike }>{likeStatus ? 'Unlike' : 'Like'}</button>
    <p>{likeCount} likes</p>
    <SubmitComment postId={postId} token={token} onCommentCreated={handleCommentCreated}/>
    {commentsList.map((comment) => (
      <Comment comment={comment} token={token} key={comment._id} postId={postId} />
    ))}  
    </div>
};

export default Post;
