import { useState, useEffect } from 'react'
import './App.css'
import About from './components/About.jsx'
import AuthForm from './components/AuthForm.jsx'
import UserProfile from './components/UserProfile.jsx'
import DevTools from './components/DevTools.jsx'
import BudgetCreator from './components/BudgetCreator.jsx'
import saielLogo from './assets/Saiel-Logo.png'
import { getCurrentUser, registerUser, loginUser, logoutUser } from './utils/auth.js'

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
  const [user, setUser] = useState(null)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authError, setAuthError] = useState('')
  const [currentPage, setCurrentPage] = useState('home') // 'home' or 'budget'

  // Apply theme to body element
  useEffect(() => {
    document.body.className = themes[currentTheme].name
  }, [currentTheme])

  // Check for existing user on app load
  useEffect(() => {
    const existingUser = getCurrentUser()
    if (existingUser) {
      setUser(existingUser)
    }
  }, [])

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev + 1) % themes.length)
  }

  const handleLogin = async ({ email, password }) => {
    try {
      setAuthError('')
      const loggedInUser = loginUser(email, password)
      setUser(loggedInUser)
      setShowAuthForm(false)
    } catch (error) {
      setAuthError(error.message)
    }
  }

  const handleSignup = async (userData) => {
    try {
      setAuthError('')
      const newUser = registerUser(userData)
      setUser(newUser)
      setShowAuthForm(false)
    } catch (error) {
      setAuthError(error.message)
    }
  }

  const handleLogout = () => {
    logoutUser()
    setUser(null)
  }

  const showLogin = () => {
    setAuthError('')
    setShowAuthForm(true)
  }

  return (
    <>
      <header className="fixed-header">
        <div className="header-left">
          <img src={saielLogo} alt="Saiel Logo" className="logo" />
          <h1 className="company-name">{companyName}</h1>
        </div>
        <nav className="header-nav">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          {user && (
            <button 
              className={`nav-link ${currentPage === 'budget' ? 'active' : ''}`}
              onClick={() => setCurrentPage('budget')}
            >
              My Budget
            </button>
          )}
          <button className="theme-toggle" onClick={toggleTheme}>
            {themes[currentTheme].icon}
          </button>
          {user ? (
            <UserProfile user={user} onLogout={handleLogout} />
          ) : (
            <button className="login-button" onClick={showLogin}>
              Sign In
            </button>
          )}
        </nav>
      </header>
      
      <main className="app-main">
        {currentPage === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                {user ? (
                  <>
                    <h1 className="hero-title">Welcome back, {user.firstName}!</h1>
                    <p className="hero-subtitle">
                      Ready to continue managing your budget and tracking your financial goals?
                    </p>
                    <div className="hero-cta">
                      <button 
                        className="cta-primary"
                        onClick={() => setCurrentPage('budget')}
                      >
                        View My Budget
                      </button>
                      <button className="cta-secondary">Add Transaction</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="hero-title">Take Control of Your Financial Future</h1>
                    <p className="hero-subtitle">
                      Build personalized budgets, track purchases, and make smarter financial decisions with {companyName}
                    </p>
                    <div className="hero-cta">
                      <button className="cta-primary" onClick={showLogin}>Get Started Free</button>
                      <button className="cta-secondary">Watch Demo</button>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
              <div className="container">
                <h2 className="section-title">Why Choose {companyName}?</h2>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Custom Budgets</h3>
                    <p>Create personalized budgets that adapt to your lifestyle and financial goals.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">💳</div>
                    <h3>Purchase Tracking</h3>
                    <p>Monitor your daily expenses and categorize spending in real-time.</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">📈</div>
                    <h3>Smart Insights</h3>
                    <p>Get actionable insights to make informed financial decisions and build wealth.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="about-section">
              <div className="container">
                <div className="about-content">
                  <About companyName={companyName} />
                </div>
              </div>
            </section>

            {/* Developer Tools - Only show in development */}
            {import.meta.env.DEV && (
              <section className="dev-tools-section">
                <div className="container">
                  <DevTools onLogin={(user) => setUser(user)} />
                </div>
              </section>
            )}
          </>
        ) : currentPage === 'budget' && user ? (
          <BudgetCreator user={user} />
        ) : (
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>Please log in to access budget features.</p>
            <button className="cta-primary" onClick={showLogin}>Sign In</button>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <div className="footer-copyright">
          © <span className="company-name-footer">{companyName}</span>, {currentYear}
        </div>
        <div className="footer-rights">
          All rights reserved.
        </div>
      </footer>
      
      {/* Authentication Form */}
      {showAuthForm && (
        <AuthForm 
          onLogin={handleLogin}
          onSignup={handleSignup}
          onClose={() => setShowAuthForm(false)}
          error={authError}
        />
      )}
    </>
  );
}

export default App
