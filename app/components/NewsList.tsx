'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Article {
  id?: number;
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  country: string;
}

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NewsList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState('general');
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<Article>('news')
      .select('*')
      .eq('category', category)
      .eq('country', country)
      .order('publishedAt', { ascending: false });

    if (error) console.error('Supabase fetch error:', error);
    else setArticles(data || []);

    setLoading(false);
  };

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') setDarkMode(true);
    fetchArticles();
  }, []);

  // Save dark mode preference whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: darkMode ? '#121212' : '#f9f9f9',
        color: darkMode ? '#f9f9f9' : '#121212',
        minHeight: '100vh',
      }}
    >
      {/* Header & Dark Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>AI News</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#f9f9f9' : '#121212',
            cursor: 'pointer',
          }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#f9f9f9' : '#121212',
          }}
        >
          <option value="general">General</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="entertainment">Entertainment</option>
        </select>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#f9f9f9' : '#121212',
          }}
        >
          <option value="us">US</option>
          <option value="ca">Canada</option>
          <option value="gb">UK</option>
          <option value="au">Australia</option>
        </select>
      </div>

      {/* Articles */}
      {loading ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, gap: '15px' }}>
          {articles.map((article, idx) => (
            <li
              key={idx}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '15px',
                boxShadow: darkMode ? '0 2px 5px rgba(255,255,255,0.05)' : '0 2px 5px rgba(0,0,0,0.05)',
                backgroundColor: darkMode ? '#1e1e1e' : '#fff',
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                {article.title}
              </h2>
              <p style={{ marginBottom: '8px' }}>{article.description}</p>
              <p style={{ fontSize: '12px', color: darkMode ? '#ccc' : '#666', marginBottom: '8px' }}>
                Source: {article.source} | Published:{' '}
                {new Date(article.publishedAt).toLocaleString()}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1a0dab', textDecoration: 'underline' }}
              >
                Read full article
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
