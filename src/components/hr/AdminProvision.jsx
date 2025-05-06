import React, { useState, useEffect } from "react";
import { getAdminProvisions, addAdminProvision, updateAdminProvision, deleteAdminProvision } from "../../api/employeeApi";
import { Link } from "react-router-dom";
import Sidebars from './sidebars';

const AdminProvision = () => {
  const [provisions, setProvisions] = useState([]);
  const [filteredProvisions, setFilteredProvisions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProvision, setEditProvision] = useState(null);
  const [newProvision, setNewProvision] = useState({
    employee: "",
    bank_account_paper: false,
    sim_card: false,
    visiting_card: false,
    placement: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProvisions = async () => {
      const response = await getAdminProvisions();
      setProvisions(response.data);
      setFilteredProvisions(response.data);
    };
    fetchProvisions();
  }, []);

  useEffect(() => {
    const filterProvisions = provisions.filter((provision) =>
      provision.employee.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProvisions(filterProvisions);
  }, [searchQuery, provisions]);

  const handleDelete = async (id) => {
    await deleteAdminProvision(id);
    setProvisions(provisions.filter((provision) => provision.id !== id));
    setFilteredProvisions(filteredProvisions.filter((provision) => provision.id !== id));
  };

  const handleEdit = (provision) => {
    setEditProvision(provision);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditProvision(null);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewProvision({ employee: "", bank_account_paper: false, sim_card: false, visiting_card: false, placement: false });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateAdminProvision(editProvision.id, editProvision);
    setProvisions(
      provisions.map((item) =>
        item.id === editProvision.id ? editProvision : item
      )
    );
    setFilteredProvisions(
      filteredProvisions.map((item) =>
        item.id === editProvision.id ? editProvision : item
      )
    );
    setIsModalOpen(false);
    setEditProvision(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const response = await addAdminProvision(newProvision);
    setProvisions([...provisions, response.data]);
    setFilteredProvisions([...filteredProvisions, response.data]);
    setIsAddModalOpen(false);
    setNewProvision({ employee: "", bank_account_paper: false, sim_card: false, visiting_card: false, placement: false });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (editProvision) {
      setEditProvision({
        ...editProvision,
        [name]: type === "checkbox" ? checked : value,
      });
    } else if (newProvision) {
      setNewProvision({
        ...newProvision,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  return (
    <div className="admin-provision-container">
      <Sidebars />
      <div className="main-content">
        <div className="header-section">
          <h2 className="heading">Admin Provision</h2>
          <div className="action-bar">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by employee name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="add-button"
            >
              + Add New Provision
            </button>
          </div>
        </div>

        {filteredProvisions.length === 0 ? (
          <div className="empty-state">
            <p>No provisions found. Add a new provision to get started.</p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredProvisions.map((provision) => (
              <div key={provision.id} className="provision-card">
                <div className="card-header">
                  <h3>{provision.employee}</h3>
                </div>
                <div className="card-body">
                  <div className="provision-item">
                    <span>Bank Account Paper:</span>
                    <span className={`status ${provision.bank_account_paper ? 'active' : 'inactive'}`}>
                      {provision.bank_account_paper ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="provision-item">
                    <span>SIM Card:</span>
                    <span className={`status ${provision.sim_card ? 'active' : 'inactive'}`}>
                      {provision.sim_card ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="provision-item">
                    <span>Visiting Card:</span>
                    <span className={`status ${provision.visiting_card ? 'active' : 'inactive'}`}>
                      {provision.visiting_card ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="provision-item">
                    <span>Placement:</span>
                    <span className={`status ${provision.placement ? 'active' : 'inactive'}`}>
                      {provision.placement ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
                <div className="card-footer">
                  <button onClick={() => handleEdit(provision)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(provision.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {isModalOpen && editProvision && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Edit Admin Provision</h3>
                <button onClick={handleModalClose} className="close-button">&times;</button>
              </div>
              <form onSubmit={handleEditSubmit} className="modal-form">
                <div className="form-group">
                  <label>Employee Name:</label>
                  <input
                    type="text"
                    name="employee"
                    value={editProvision.employee || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="bank_account_paper"
                      checked={editProvision.bank_account_paper || false}
                      onChange={handleInputChange}
                    />
                    <span>Bank Account Paper</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sim_card"
                      checked={editProvision.sim_card || false}
                      onChange={handleInputChange}
                    />
                    <span>SIM Card</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="visiting_card"
                      checked={editProvision.visiting_card || false}
                      onChange={handleInputChange}
                    />
                    <span>Visiting Card</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="placement"
                      checked={editProvision.placement || false}
                      onChange={handleInputChange}
                    />
                    <span>Placement</span>
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-button">Save Changes</button>
                  <button type="button" onClick={handleModalClose} className="cancel-button">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add New Admin Provision Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Add New Admin Provision</h3>
                <button onClick={handleAddModalClose} className="close-button">&times;</button>
              </div>
              <form onSubmit={handleAddSubmit} className="modal-form">
                <div className="form-group">
                  <label>Employee Name:</label>
                  <input
                    type="text"
                    name="employee"
                    value={newProvision.employee}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="bank_account_paper"
                      checked={newProvision.bank_account_paper}
                      onChange={handleInputChange}
                    />
                    <span>Bank Account Paper</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="sim_card"
                      checked={newProvision.sim_card}
                      onChange={handleInputChange}
                    />
                    <span>SIM Card</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="visiting_card"
                      checked={newProvision.visiting_card}
                      onChange={handleInputChange}
                    />
                    <span>Visiting Card</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="placement"
                      checked={newProvision.placement}
                      onChange={handleInputChange}
                    />
                    <span>Placement</span>
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-button">Add Provision</button>
                  <button type="button" onClick={handleAddModalClose} className="cancel-button">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-provision-container {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .main-content {
          flex: 1;
          padding: 2rem;
          margin-left: 20px;
        }
        
        .header-section {
          margin-bottom: 2rem;
        }
        
        .heading {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        
        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        
        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }
        
        .add-button {
          background-color: #3498db;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .add-button:hover {
          background-color: #2980b9;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          color: #7f8c8d;
        }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .provision-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .provision-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #eee;
          background-color: #f8f9fa;
        }
        
        .card-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #2c3e50;
          font-weight: 600;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .provision-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .provision-item:last-child {
          margin-bottom: 0;
        }
        
        .status {
          font-weight: 500;
        }
        
        .status.active {
          color: #27ae60;
        }
        
        .status.inactive {
          color: #e74c3c;
        }
        
        .card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
          display: flex;
          gap: 0.75rem;
        }
        
        .edit-button, .delete-button {
          flex: 1;
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .edit-button {
          background-color: #f39c12;
          color: white;
        }
        
        .edit-button:hover {
          background-color: #e67e22;
        }
        
        .delete-button {
          background-color: #e74c3c;
          color: white;
        }
        
        .delete-button:hover {
          background-color: #c0392b;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal {
          background-color: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #2c3e50;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #7f8c8d;
          padding: 0.25rem;
        }
        
        .modal-form {
          padding: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2c3e50;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        
        .checkbox-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.95rem;
        }
        
        .checkbox-label input {
          width: 1.1em;
          height: 1.1em;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }
        
        .save-button, .cancel-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .save-button {
          background-color: #3498db;
          color: white;
        }
        
        .save-button:hover {
          background-color: #2980b9;
        }
        
        .cancel-button {
          background-color: #f5f5f5;
          color: #2c3e50;
        }
        
        .cancel-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default AdminProvision;