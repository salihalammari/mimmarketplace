// React Integration Example
// Install: npm install axios

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://mimmarketplace.onrender.com';

function ApplicationForm() {
  const [formData, setFormData] = useState({
    seller_name: '',
    email: '',
    phone: '',
    category: '',
    language: 'en',
    submitted_fields: {}
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_URL}/applications`, formData);
      setMessage({
        type: 'success',
        text: `Success! Application ID: ${response.data.id}`
      });
      setFormData({
        seller_name: '',
        email: '',
        phone: '',
        category: '',
        language: 'en',
        submitted_fields: {}
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-form">
      <h2>Seller Application Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Seller Name *
            <input
              type="text"
              name="seller_name"
              value={formData.seller_name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Email *
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Phone
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
        </div>

        <div>
          <label>
            Category *
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Living</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Language *
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

export default ApplicationForm;

