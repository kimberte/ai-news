import styles from './styles/Home.module.css';
import NewsList from './components/NewsList';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>AI News Feed</h1>
      <NewsList />
    </div>
  );
}
