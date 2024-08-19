import React, { useState } from 'react';
import './blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Handle form submission to add a new post
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newPost = {
        date: new Date().toLocaleDateString(),
        content: inputValue,
        image: imageFile,
      };
      setPosts([newPost, ...posts]);
      setInputValue('');
      setImageFile(null);
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle removing a post
  const handleRemove = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
  };

  return (
    <section id="blog">
      <h1>Project Journey Blog</h1>
      <form onSubmit={handleSubmit} className="blog-form">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Write about your journey today..."
          required
        ></textarea>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Add Entry</button>
      </form>
      <div className="blog-entries">
        {posts.length === 0 ? (
          <p>No entries yet. Start documenting your journey!</p>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="entry">
              <button className="remove-button" onClick={() => handleRemove(index)}>
                &times;
              </button>
              <p className="date">{post.date}</p>
              {post.image && <img src={post.image} alt="Blog entry" />}
              <p className="content">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Blog;
