import './App.css'
import About from './components/About.jsx'

function App() {
  const companyName="Saiel"
  const currentYear = new Date().getFullYear()

  return (
    <>
      <video 
        className="video-background"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="./assets/7670835-uhd_3840_2160_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <header className="fixed-header">
        <div className="header-left">
          <div className="logo">💰</div>
          <h1 className="company-name">{companyName}</h1>
        </div>
        <nav className="header-nav">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
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
          © {companyName}, {currentYear}
        </div>
        <div className="footer-rights">
          All rights reserved.
        </div>
      </footer>
    </>
  );
}

export default App
