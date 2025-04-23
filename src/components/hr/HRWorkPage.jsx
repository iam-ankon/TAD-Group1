import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiMail, FiFileText, FiDollarSign, FiTerminal, FiSend, FiLogOut, FiPieChart, FiBriefcase, FiClock, FiHome, FiVoicemail } from 'react-icons/fi';
import axios from 'axios'; // Import axios
import Sidebars from './sidebars';

const HRWorkPage = () => {
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [cvCount, setCvCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const response = await axios.get('http://192.168.0.163:8000/api/hrms/api/employees/');
        setEmployeeCount(response.data.length || 0);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchInterviews = async () => {
      try {
        const response = await axios.get('http://192.168.0.163:8000/api/hrms/api/interviews/');
        setUpcomingInterviews(response.data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('http://192.168.0.163:8000/api/hrms/api/employee_leaves/');
        setLeaveRequests(response.data);
        console.log("Leave Requests:", response.data)
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    const fetchCVCount = async () => {
      try {
        const response = await axios.get('http://192.168.0.163:8000/api/hrms/api/CVAdd/');
        setCvCount(response.data.length || 0);
      } catch (error) {
        console.error('Error fetching CV count:', error)
      }
    }

    fetchEmployeeCount();
    fetchInterviews();
    fetchLeaveRequests();
    fetchCVCount();
  }, []);
  useEffect(() => {
    const trackablePages = ['/employees', '/interviews', '/employee_leave', '/cv-list', '/attendance'];

    if (trackablePages.includes(location.pathname)) {
      trackActivity(location.pathname);
      // Retrieve recent activities only if it's a trackable page
      const storedActivities = JSON.parse(localStorage.getItem('recentActivities')) || [];
      setRecentActivities(storedActivities);
    } else {
      //if it is not a trackable page, still try to retrieve from local storage.
      const storedActivities = JSON.parse(localStorage.getItem('recentActivities')) || [];
      setRecentActivities(storedActivities);
    }

  }, [location.pathname]);

  const trackActivity = (page) => {
    const newActivity = {
      page: page,
      timestamp: new Date().toISOString(),
    };

    const storedActivities = JSON.parse(localStorage.getItem('recentActivities')) || [];
    const updatedActivities = [newActivity, ...storedActivities.slice(0, 4)]; // Keep last 5

    localStorage.setItem('recentActivities', JSON.stringify(updatedActivities));
  };

  const getActivityDescription = (page) => {
    switch (page) {
      case '/employees':
        return 'Visited Employees Page';
      case '/interviews':
        return 'Visited Interviews Page';
      case '/employee_leave':
        return 'Visited Leave Management Page';
      case '/cv-list':
        return 'Visited CV list Page';
      case '/attendance':
        return 'Visited Attendance Page';
      default:
        return `Visited ${page}`;
    }
  };

  const getActivityIcon = (page) => {
    switch (page) {
      case '/employees':
        return <FiUsers />;
      case '/interviews':
        return <FiBriefcase />;
      case '/employee_leave':
        return <FiCalendar />;
      case '/cv-list':
        return <FiFileText />;
      case '/attendance':
        return <FiClock />;
      default:
        return <FiMail />;
    }
  }
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const stats = [
    { title: 'Total Employees', value: employeeCount, icon: <FiUsers size={24} />, link: '/employees' },
    { title: 'Interviews', value: upcomingInterviews.length, icon: <FiBriefcase size={24} />, link: '/interviews' },
    { title: 'Pending Leave Requests', value: leaveRequests.filter(req => req.status === 'pending').length, icon: <FiCalendar size={24} />, link: '/employee_leave' },
    { title: 'CV Bank', value: cvCount, icon: <FiFileText size={24} />, link: '/cv-list' },
  ];

  const quickActions = [
    { title: 'Add New Employee', icon: <FiUsers size={20} />, link: '/add-employee' },
    { title: 'Schedule Interview', icon: <FiBriefcase size={20} />, link: '/interviews/schedule' },
    { title: 'Process Payroll', icon: <FiDollarSign size={20} />, link: '/finance-provision' },
    { title: 'Send Announcement', icon: <FiSend size={20} />, link: '/letter-send' },
  ];
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex' }}>
        <Sidebars />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Your page content here */}
        </div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#374151' }}>HR Dashboard</h1>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{formattedDate}</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{ padding: '1.5rem' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb', transition: 'box-shadow 0.3s ease-in-out', cursor: 'pointer', ':hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } }}
                onClick={() => navigate(stat.link)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>{stat.title}</p>
                    {loading && stat.title === 'Total Employees' ? (
                      <div style={{ height: '2rem', width: '4rem', marginTop: '0.5rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                    ) : error && stat.title === 'Total Employees' ? (
                      <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>Error loading</p>
                    ) : (
                      <p style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{stat.value}</p>
                    )}
                  </div>
                  <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '0.375rem', color: '#2563eb' }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb', transition: 'box-shadow 0.3s ease-in-out', display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', ':hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } }}
                >
                  <div style={{ marginRight: '0.75rem', padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '0.375rem', color: '#2563eb' }}>
                    {action.icon}
                  </div>
                  <span style={{ fontWeight: 500 }}>{action.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>Interviews</h2>
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb' }}>
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', ':hover': { backgroundColor: '#f9fafb' } }} onClick={() => navigate(`/interviews/${interview.id}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontWeight: 500 }}>{interview.name || 'No Candidate'}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{interview.position_for || 'No Position'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 500 }}>{interview.time}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{interview.interview_date}</p>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingInterviews.length === 0 && (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                  No upcoming interviews scheduled
                </div>
              )}
            </div>
            <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'right' }}>
              <Link to="/interviews" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, ':hover': { color: '#1d4ed8' } }}>
                View All Interviews →
              </Link>
            </div>
          </div>

          {/* Pending Leave Requests */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>Pending Leave Requests</h2>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb' }}>
                {leaveRequests.filter(req => req.status === 'pending').map((request) => (
                  <div key={request.id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', ':hover': { backgroundColor: '#f9fafb' } }} onClick={() => navigate(`/leave-request-details/${request.id}`)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontWeight: 500 }}>{request.employee_name}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{request.leave_type}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 500 }}>{request.start_date} to {request.end_date}</p>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 500, backgroundColor: '#fffbeb', color: '#d97706', borderRadius: '9999px' }}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {leaveRequests.filter(req => req.status === 'pending').length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    No pending leave requests
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'right' }}>
                <Link to="/employee_leave" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, ':hover': { color: '#1d4ed8' } }}>
                  View All Leave Requests →
                </Link>
              </div>
            </div>

            {/* Recent Activities */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>Recent Activities</h2>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb' }}>
                {recentActivities.map((activity, index) => (
                  <div key={index} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ marginRight: '0.75rem', padding: '0.5rem', backgroundColor: '#dcfce7', borderRadius: '0.375rem', color: '#16a34a' }}>
                        {getActivityIcon(activity.page)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500 }}>{getActivityDescription(activity.page)}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default HRWorkPage;