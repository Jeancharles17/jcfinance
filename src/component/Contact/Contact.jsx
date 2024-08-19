import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID')
      .then((response) => {
        console.log('Message sent successfully:', response);
        setSubmitted(true);
        setError('');
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      })
      .catch((err) => {
        console.error('Failed to send message:', err);
        setError('There was a problem sending your message. Please try again.');
      });
  };

  return (
    <section id="contact">
      <h1>Contact Me</h1>
      <div className="contact-container">
        <div className="contact-form">
          {submitted ? (
            <p className="success-message">Thank you for your message! I will get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
              ></textarea>
              <button type="submit">Send Message</button>
              {error && <p className="error-message">{error}</p>}
            </form>
          )}
        </div>

        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="contact-info-item">
            <h3>GitHub</h3>
            <a href="https://github.com/Jeancharles17" target="_blank" rel="noopener noreferrer" className="contact-link">Jeanchales17</a>
          </div>
          <div className="contact-info-item">
            <h3>LinkedIn</h3>
            <a href="linkedin.com/in/jean-charles-8310b8208" target="_blank" rel="noopener noreferrer" className="contact-link">JeanCharles</a>
          </div>
          <div className="contact-info-item">
            <h3>Phone</h3>
            <p className="contact-text">+1 (305) 813-3952</p>
          </div>
        </div>
      </div>

      <footer>
        <p>&copy; 2024 Jean Charles. All rights reserved.</p>
      </footer>
    </section>
  );
};

export default Contact;
