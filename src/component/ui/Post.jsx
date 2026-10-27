import React, { useState, useEffect } from "react";
import { getPost, storePost } from "../../api/post";
import "./styles/post.css";
import PostCard from "../PostCard";

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPost();
        const loadedPosts = response.data.data ?? response.data;

        if (!Array.isArray(loadedPosts)) {
          throw new Error("The posts response was not a list.");
        }

        setPosts(loadedPosts);
      } catch {
        setLoadError("Unable to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (message.trim() && error === "Post cannot be empty") {
      setError("");
    }
  }, [message, error]);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Post cannot be empty");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const response = await storePost({ message });
      const newPost = response.data.data ?? response.data;
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setMessage("");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to share post. please try again.";
      setError(errMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="post-container">
      <section className="post-composer" aria-labelledby="create-post-title">
        <h1 className="post-title" id="create-post-title">
          Create Post
        </h1>
        <form onSubmit={submit} className="post-form">
          <textarea
            value={message}
            placeholder="What's on your mind?"
            className="post-textarea"
            aria-label="Post message"
            onChange={(e) => setMessage(e.target.value)}
            disabled={processing}
          />
          {error && <div className="post-error" role="alert">{error}</div>}

          <div className="post-footer">
            <button
              type="submit"
              className="post-submit-btn"
              disabled={processing || !message.trim()}
            >
              {processing ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </section>
      {loadError && <p className="post-load-error" role="alert">{loadError}</p>}
      <section className="post-feed-list" aria-label="Posts">
        {posts.map((post, index) => (
          <PostCard key={post.id ?? index} post={post} />
        ))}
      </section>
    </div>
  );
}