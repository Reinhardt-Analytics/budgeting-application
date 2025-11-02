import { useState, useEffect } from 'react'
import './App.css'
import About from './components/About.jsx'
import saielLogo from './assets/Saiel-Logo.png'

const themes = [
  { name: 'dark-theme', icon: '☀️' },    // Show sun when in dark mode
  { name: 'light-theme', icon: '🌙' },   // Show moon when in light mode
  { name: 'white-theme', icon: '⚫' },   // Show black circle when in white mode
  { name: 'black-theme', icon: '⚪' }    // Show white circle when in black mode
]

function App() {
  const companyName="Saiel"
  const currentYear = new Date().getFullYear()
  const [currentTheme, setCurrentTheme] = useState(0) // 0: dark, 1: light, 2: white, 3: black

  // Apply theme to body element
  useEffect(() => {
    document.body.className = themes[currentTheme].name
  }, [currentTheme])

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev + 1) % themes.length)
  }

  return (
    <>
      <header className="fixed-header">
        <div className="header-left">
          <img src={saielLogo} alt="Saiel Logo" className="logo" />
          <h1 className="company-name">{companyName}</h1>
        </div>
        <nav className="header-nav">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <button className="theme-toggle" onClick={toggleTheme}>
            {themes[currentTheme].icon}
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        <div className="headerCard">
          <h2 className="introCard">
            Welcome to {companyName}! Your friendly, accessible budgeting app.
          </h2>
          <About companyName={companyName} />
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="footer-copyright">
          © <span className="company-name-footer">{companyName}</span>, {currentYear}
        </div>
        <div className="footer-rights">
          All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default App
