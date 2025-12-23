'use client'

import { useState } from 'react'
import NewsList from './components/NewsList'
import styles from './page.module.css'

export default function HomePage() {
  const [category, setCategory] = useState('general')
  const [country, setCountry] = useState('us')

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>AI News</h1>

        <div className={styles.filters}>
          <select
            className={styles.select}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="business">Business</option>
            <option value="technology">Technology</option>
            <option value="health">Health</option>
            <option value="sports">Sports</option>
          </select>

          <select
            className={styles.select}
            value={country}
            onChange={e => setCountry(e.target.value)}
          >
            <option value="us">US</option>
            <option value="ca">Canada</option>
            <option value="gb">UK</option>
            <option value="au">Australia</option>
          </select>
        </div>
      </header>

      <NewsList category={category} country={country} />
    </main>
  )
}
