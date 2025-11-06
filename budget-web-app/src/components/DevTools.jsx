import { useEffect } from 'react'
import { createDummyAccounts, loginDemo, resetAllData, getUserStats } from '../utils/auth.js'

export default function DevTools({ onLogin }) {
  // Automatically create dummy accounts when component loads
  useEffect(() => {
    createDummyAccounts()
  }, [])

  const handleCreateDummyAccounts = () => {
    createDummyAccounts()
    alert('Dummy accounts created! Check console for details.')
  }

  const handleQuickLogin = (demoNumber) => {
    try {
      const user = loginDemo(demoNumber)
      onLogin(user)
      alert(`Logged in as ${user.firstName} ${user.lastName}`)
    } catch (error) {
      alert(error.message)
    }
  }

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all user data? This cannot be undone.')) {
      resetAllData()
      alert('All data has been reset!')
      window.location.reload()
    }
  }

  const handleShowStats = () => {
    const stats = getUserStats()
    alert(`User Stats:\nTotal Users: ${stats.totalUsers}\nPromotional Opt-ins: ${stats.promotionalOptIns}\nOpt-in Rate: ${stats.optInRate}%`)
  }

  return (
    <div className="dev-tools">
      <h3>🛠️ Developer Tools</h3>
      <div className="dev-tools-grid">
        <button onClick={handleCreateDummyAccounts} className="dev-btn">
          Create Demo Accounts
        </button>
        
        <button onClick={() => handleQuickLogin(1)} className="dev-btn">
          Login as John Smith
        </button>
        
        <button onClick={() => handleQuickLogin(2)} className="dev-btn">
          Login as Sarah Johnson
        </button>
        
        <button onClick={() => handleQuickLogin(3)} className="dev-btn">
          Login as Mike Wilson
        </button>
        
        <button onClick={handleShowStats} className="dev-btn">
          Show User Stats
        </button>
        
        <button onClick={handleResetData} className="dev-btn danger">
          Reset All Data
        </button>
      </div>
      
      <div className="demo-credentials">
        <h4>Demo Account Credentials:</h4>
        <div className="credential-list">
          <div><strong>john.smith@demo.com</strong> | demo123</div>
          <div><strong>sarah.johnson@demo.com</strong> | demo123</div>
          <div><strong>mike.wilson@demo.com</strong> | demo123</div>
        </div>
      </div>
    </div>
  )
}