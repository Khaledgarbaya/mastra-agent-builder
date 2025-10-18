import { useEffect } from 'react';
import { BuilderPage } from './components/BuilderPage';
import './styles.css';

function App() {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    return () => {
      root.classList.remove('dark');
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <BuilderPage />
    </div>
  );
}

export default App;
