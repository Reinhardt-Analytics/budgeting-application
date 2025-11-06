import React, { useState, useEffect } from 'react';
import { getBudget, saveBudget } from '../utils/auth.js';

const BudgetCreator = ({ user }) => {
  const [showBudgetTable, setShowBudgetTable] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('JANUARY');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [categoryLimit, setCategoryLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  // Load budget data when month/year changes
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const existingBudget = getBudget(user.id, selectedMonth, selectedYear);
      
      if (existingBudget && existingBudget.categories) {
        setCategories(existingBudget.categories);
      } else {
        // Set default categories for new budget
        setCategories([
          { id: Date.now() + 1, name: 'Housing', budgeted: 0, spent: 0, remaining: 0 },
          { id: Date.now() + 2, name: 'Transportation', budgeted: 0, spent: 0, remaining: 0 },
          { id: Date.now() + 3, name: 'Food', budgeted: 0, spent: 0, remaining: 0 },
          { id: Date.now() + 4, name: 'Utilities', budgeted: 0, spent: 0, remaining: 0 },
          { id: Date.now() + 5, name: 'Entertainment', budgeted: 0, spent: 0, remaining: 0 },
          { id: Date.now() + 6, name: 'Savings', budgeted: 0, spent: 0, remaining: 0 }
        ]);
      }
      setIsLoading(false);
    }
  }, [user, selectedMonth, selectedYear]);

  // Auto-save budget data when categories change
  useEffect(() => {
    if (user && categories.length > 0 && !isLoading) {
      const timeoutId = setTimeout(() => {
        const budgetData = { categories };
        saveBudget(user.id, selectedMonth, selectedYear, budgetData);
        setSaveMessage('Budget saved automatically');
        setTimeout(() => setSaveMessage(''), 2000);
      }, 1000); // Save 1 second after last change

      return () => clearTimeout(timeoutId);
    }
  }, [categories, user, selectedMonth, selectedYear, isLoading]);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now(),
        name: newCategoryName.trim(),
        budgeted: 0,
        spent: 0,
        remaining: 0
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    }
  };

  const handleCategoryUpdate = (id, field, value) => {
    setCategories(categories.map(category => {
      if (category.id === id) {
        const updated = { ...category, [field]: parseFloat(value) || 0 };
        if (field === 'budgeted' || field === 'spent') {
          updated.remaining = updated.budgeted - updated.spent;
        }
        return updated;
      }
      return category;
    }));
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const getDaysInMonth = (month, year) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const monthIndex = months.indexOf(month);
    return new Date(year, monthIndex, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const dayNames = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];

    // Add day headers
    dayNames.forEach(day => {
      days.push(<div key={day} className="calendar-day-header">{day}</div>);
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${day === 13 ? 'selected' : ''}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <div className="budget-creator">
      {!showBudgetTable ? (
        <div className="budget-intro">
          <h1>Create Your Budget</h1>
          <p>Welcome to your personal budget management system. Take control of your finances by creating detailed monthly budgets that help you track spending, plan for the future, and achieve your financial goals.</p>
          <p>Get started by clicking the button below to access our intuitive budget creation tools.</p>
          <button 
            className="create-budget-btn"
            onClick={() => setShowBudgetTable(true)}
          >
            Start Creating Your Budget
          </button>
        </div>
      ) : (
        <div className="budget-interface">
          <div className="budget-header">
            <div>
              <h1>Budget Creator</h1>
              {saveMessage && <div className="save-message">{saveMessage}</div>}
            </div>
            <button 
              className="back-btn"
              onClick={() => setShowBudgetTable(false)}
            >
              ← Back to Intro
            </button>
          </div>

          <div className="budget-content">
            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="month-selector"
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="year-selector"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="calendar-grid">
                {renderCalendar()}
              </div>
            </div>

            {/* Category Management Section */}
            <div className="category-management">
              <div className="category-controls">
                <div className="search-section">
                  <input
                    type="text"
                    placeholder="Search Category"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="add-category-section">
                  <input
                    type="text"
                    placeholder="New Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="add-category-input"
                  />
                  <button onClick={handleAddCategory} className="add-category-btn">
                    Add Category →
                  </button>
                </div>

                <div className="view-controls">
                  <button className="view-all-btn">View All Categories</button>
                  <select 
                    value={categoryLimit} 
                    onChange={(e) => setCategoryLimit(parseInt(e.target.value))}
                    className="limit-selector"
                  >
                    <option value={0}>Limit: $0.00</option>
                    <option value={100}>Limit: $100.00</option>
                    <option value={500}>Limit: $500.00</option>
                    <option value={1000}>Limit: $1000.00</option>
                  </select>
                </div>
              </div>

              {/* Budget Table */}
              <div className="budget-table-container">
                <table className="budget-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Budgeted</th>
                      <th>Spent</th>
                      <th>Remaining</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map(category => (
                      <tr key={category.id}>
                        <td className="category-name">{category.name}</td>
                        <td>
                          <input
                            type="number"
                            value={category.budgeted}
                            onChange={(e) => handleCategoryUpdate(category.id, 'budgeted', e.target.value)}
                            className="budget-input"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={category.spent}
                            onChange={(e) => handleCategoryUpdate(category.id, 'spent', e.target.value)}
                            className="budget-input"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className={`remaining ${category.remaining < 0 ? 'negative' : 'positive'}`}>
                          ${category.remaining.toFixed(2)}
                        </td>
                        <td>
                          <button 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="totals-row">
                      <td><strong>Total</strong></td>
                      <td><strong>${totalBudgeted.toFixed(2)}</strong></td>
                      <td><strong>${totalSpent.toFixed(2)}</strong></td>
                      <td className={`remaining ${totalRemaining < 0 ? 'negative' : 'positive'}`}>
                        <strong>${totalRemaining.toFixed(2)}</strong>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  &lt;
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                {totalPages > 5 && <span className="pagination-ellipsis">...</span>}
                
                {totalPages > 5 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                  >
                    {totalPages}
                  </button>
                )}
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCreator;