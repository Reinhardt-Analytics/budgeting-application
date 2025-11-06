// User authentication and storage utilities

export const AUTH_STORAGE_KEY = 'saiel_users'
export const CURRENT_USER_KEY = 'saiel_current_user'

// Get all users from localStorage
export const getUsers = () => {
  try {
    const users = localStorage.getItem(AUTH_STORAGE_KEY)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error('Error reading users from localStorage:', error)
    return []
  }
}

// Save users to localStorage
export const saveUsers = (users) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Error saving users to localStorage:', error)
  }
}

// Get current logged-in user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error reading current user from localStorage:', error)
    return null
  }
}

// Set current logged-in user
export const setCurrentUser = (user) => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } catch (error) {
    console.error('Error saving current user to localStorage:', error)
  }
}

// Remove current user (logout)
export const removeCurrentUser = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
  } catch (error) {
    console.error('Error removing current user from localStorage:', error)
  }
}

// Check if email already exists
export const emailExists = (email) => {
  const users = getUsers()
  return users.some(user => user.email.toLowerCase() === email.toLowerCase())
}

// Register a new user
export const registerUser = (userData) => {
  const users = getUsers()
  
  // Check if email already exists
  if (emailExists(userData.email)) {
    throw new Error('An account with this email already exists')
  }
  
  // Create new user with timestamp
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
  
  // Add to users array
  users.push(newUser)
  saveUsers(users)
  
  // Set as current user
  setCurrentUser(newUser)
  
  return newUser
}

// Login user
export const loginUser = (email, password) => {
  const users = getUsers()
  
  // Find user by email and password
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  
  if (!user) {
    throw new Error('Invalid email or password')
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString()
  
  // Update user in storage
  const userIndex = users.findIndex(u => u.id === user.id)
  users[userIndex] = user
  saveUsers(users)
  
  // Set as current user
  setCurrentUser(user)
  
  return user
}

// Logout user
export const logoutUser = () => {
  removeCurrentUser()
}

// Get user stats (for admin purposes)
export const getUserStats = () => {
  const users = getUsers()
  const promotionalOptIns = users.filter(user => user.promotionalEmails).length
  
  return {
    totalUsers: users.length,
    promotionalOptIns,
    optInRate: users.length > 0 ? (promotionalOptIns / users.length * 100).toFixed(1) : 0
  }
}

// Create dummy accounts for testing
export const createDummyAccounts = () => {
  const existingUsers = getUsers()
  
  const dummyAccounts = [
    {
      id: 'demo-user-1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@demo.com',
      password: 'demo123',
      promotionalEmails: true,
      createdAt: new Date('2025-10-01').toISOString(),
      lastLogin: new Date('2025-11-01').toISOString()
    },
    {
      id: 'demo-user-2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@demo.com',
      password: 'demo123',
      promotionalEmails: false,
      createdAt: new Date('2025-10-15').toISOString(),
      lastLogin: new Date('2025-11-03').toISOString()
    },
    {
      id: 'demo-user-3',
      firstName: 'Mike',
      lastName: 'Wilson',
      email: 'mike.wilson@demo.com',
      password: 'demo123',
      promotionalEmails: true,
      createdAt: new Date('2025-10-20').toISOString(),
      lastLogin: new Date('2025-11-04').toISOString()
    }
  ]
  
  // Only add accounts that don't already exist
  const newAccounts = dummyAccounts.filter(dummy => 
    !existingUsers.some(user => user.email === dummy.email)
  )
  
  if (newAccounts.length > 0) {
    const updatedUsers = [...existingUsers, ...newAccounts]
    saveUsers(updatedUsers)
    console.log(`Created ${newAccounts.length} dummy accounts for testing`)
    return newAccounts
  }
  
  console.log('Dummy accounts already exist')
  return []
}

// Quick login for demo accounts
export const loginDemo = (demoNumber = 1) => {
  const demoEmails = [
    'john.smith@demo.com',
    'sarah.johnson@demo.com', 
    'mike.wilson@demo.com'
  ]
  
  const email = demoEmails[demoNumber - 1]
  if (!email) {
    throw new Error('Invalid demo number. Use 1, 2, or 3')
  }
  
  return loginUser(email, 'demo123')
}

// Make functions available globally for console testing (development only)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.loginDemo = loginDemo
  window.createDummyAccounts = createDummyAccounts
  window.resetAllData = resetAllData
  window.getUserStats = getUserStats
}

// Reset all data (for testing)
export const resetAllData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem('saiel_budgets')
  console.log('All user data has been reset')
}

// ===== BUDGET DATA MANAGEMENT =====

export const BUDGET_STORAGE_KEY = 'saiel_budgets'

// Get all budgets from localStorage
export const getBudgets = () => {
  try {
    const budgets = localStorage.getItem(BUDGET_STORAGE_KEY)
    return budgets ? JSON.parse(budgets) : {}
  } catch (error) {
    console.error('Error reading budgets from localStorage:', error)
    return {}
  }
}

// Save budgets to localStorage
export const saveBudgets = (budgets) => {
  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets))
  } catch (error) {
    console.error('Error saving budgets to localStorage:', error)
  }
}

// Get user's budgets
export const getUserBudgets = (userId) => {
  const allBudgets = getBudgets()
  return allBudgets[userId] || {}
}

// Save user's budget for a specific month/year
export const saveBudget = (userId, month, year, budgetData) => {
  const allBudgets = getBudgets()
  const userBudgets = allBudgets[userId] || {}
  const budgetKey = `${month}-${year}`
  
  userBudgets[budgetKey] = {
    ...budgetData,
    lastModified: new Date().toISOString(),
    month,
    year
  }
  
  allBudgets[userId] = userBudgets
  saveBudgets(allBudgets)
  
  return userBudgets[budgetKey]
}

// Get user's budget for a specific month/year
export const getBudget = (userId, month, year) => {
  const userBudgets = getUserBudgets(userId)
  const budgetKey = `${month}-${year}`
  return userBudgets[budgetKey] || null
}

// Delete user's budget for a specific month/year
export const deleteBudget = (userId, month, year) => {
  const allBudgets = getBudgets()
  const userBudgets = allBudgets[userId] || {}
  const budgetKey = `${month}-${year}`
  
  delete userBudgets[budgetKey]
  allBudgets[userId] = userBudgets
  saveBudgets(allBudgets)
  
  return true
}

// Get budget summary for a user
export const getBudgetSummary = (userId) => {
  const userBudgets = getUserBudgets(userId)
  const budgetKeys = Object.keys(userBudgets)
  
  return {
    totalBudgets: budgetKeys.length,
    budgets: budgetKeys.map(key => {
      const budget = userBudgets[key]
      const totalBudgeted = budget.categories?.reduce((sum, cat) => sum + (cat.budgeted || 0), 0) || 0
      const totalSpent = budget.categories?.reduce((sum, cat) => sum + (cat.spent || 0), 0) || 0
      
      return {
        key,
        month: budget.month,
        year: budget.year,
        totalBudgeted,
        totalSpent,
        remaining: totalBudgeted - totalSpent,
        lastModified: budget.lastModified,
        categoriesCount: budget.categories?.length || 0
      }
    }).sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
  }
}

// Create sample budget data for demo accounts
export const createSampleBudgets = () => {
  const demoUsers = [
    { email: 'john.smith@demo.com', id: 'john-smith-demo' },
    { email: 'sarah.johnson@demo.com', id: 'sarah-johnson-demo' },
    { email: 'mike.wilson@demo.com', id: 'mike-wilson-demo' }
  ]
  
  const sampleCategories = [
    { id: 1, name: 'Housing', budgeted: 1200, spent: 1150, remaining: 50 },
    { id: 2, name: 'Transportation', budgeted: 400, spent: 380, remaining: 20 },
    { id: 3, name: 'Food', budgeted: 600, spent: 580, remaining: 20 },
    { id: 4, name: 'Utilities', budgeted: 200, spent: 195, remaining: 5 },
    { id: 5, name: 'Entertainment', budgeted: 300, spent: 250, remaining: 50 },
    { id: 6, name: 'Savings', budgeted: 500, spent: 500, remaining: 0 },
    { id: 7, name: 'Healthcare', budgeted: 150, spent: 75, remaining: 75 },
    { id: 8, name: 'Shopping', budgeted: 200, spent: 180, remaining: 20 }
  ]
  
  demoUsers.forEach(user => {
    // Create budget for current month
    const currentDate = new Date()
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()
    const currentYear = currentDate.getFullYear()
    
    // Slightly randomize the budget data for each user
    const randomizedCategories = sampleCategories.map(cat => ({
      ...cat,
      budgeted: cat.budgeted + (Math.random() * 200 - 100), // +/- $100
      spent: cat.spent + (Math.random() * 100 - 50) // +/- $50
    })).map(cat => ({
      ...cat,
      remaining: cat.budgeted - cat.spent
    }))
    
    const budgetData = {
      categories: randomizedCategories,
      createdAt: new Date().toISOString()
    }
    
    saveBudget(user.id, currentMonth, currentYear, budgetData)
  })
  
  console.log('Created sample budgets for demo accounts')
}

// Make functions available globally for console testing (development only)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.loginDemo = loginDemo
  window.createDummyAccounts = createDummyAccounts
  window.resetAllData = resetAllData
}