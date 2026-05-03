import React from 'react';
import Navbar from './components/Navbar';
import ElectionTimeline from './components/ElectionTimeline';
import AssistantChat from './components/AssistantChat';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <div className="hero-section">
          <header className="page-header">
            <h1>Understand Your Election Process</h1>
            <p>
              Navigate the democratic process with confidence. Use the timeline to learn about
              each step, or ask our AI assistant any questions you have.
            </p>
          </header>
          <ElectionTimeline />
        </div>
        
        <div className="assistant-section">
          <AssistantChat />
        </div>
      </main>

      <footer className="app-footer">
        
      </footer>
    </div>
  );
}

export default App;
