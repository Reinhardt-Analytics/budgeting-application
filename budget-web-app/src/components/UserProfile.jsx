import { useState } from 'react'

export default function UserProfile({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)
  
  const handleLogout = () => {
    onLogout()
    setShowDropdown(false)
  }
  
  return (
    <div className="user-profile">
      <button 
        className="profile-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="avatar">
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <span className="username">
          {user.firstName} {user.lastName}
        </span>
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="user-info">
              <div className="user-name">{user.firstName} {user.lastName}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-actions">
            <button className="dropdown-item">
              ⚙️ Settings
            </button>
            <button className="dropdown-item">
              📊 My Budget
            </button>
            <button className="dropdown-item">
              📈 Reports
            </button>
            <div className="dropdown-divider"></div>
            <button 
              className="dropdown-item logout"
              onClick={handleLogout}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}