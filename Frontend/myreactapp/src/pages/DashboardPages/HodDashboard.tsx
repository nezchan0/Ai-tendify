import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HodInfo from './HodDashboardComponents/HodInfo';
import DepartmentAnalytics from './HodDashboardComponents/DepartmentAnalytics';
import TsaAnalytics from './HodDashboardComponents/TsaAnalytics';

const HodDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string>('');
  const [hodData_section1, setHodData_section1] = useState<any>(null);
  const [hodData_section2, setHodData_section2] = useState<any>(null);
  const [hodData_section3, setHodData_section3] = useState<any>(null);

  useEffect(() => {
    const fetchHodData = async () => {
      try {
        const tokenString = localStorage.getItem('token');
        if (!tokenString) {
          console.error('No token found');
          navigate('/');
          return;
        }
        
        const token = JSON.parse(tokenString);
        const TeacherId = token.user_id;
        setTeacherId(TeacherId);

        // Fetch HOD info
        const response1 = await fetch(`http://127.0.0.1:8000/api/hod-info/${TeacherId}/`);
        const data1 = await response1.json();
        setHodData_section1(data1);

        // Fetch department analytics
        const response2 = await fetch(`http://127.0.0.1:8000/api/department-analytics/${TeacherId}/`);
        const data2 = await response2.json();
        setHodData_section2(data2);

        // Fetch TSA analytics
        const response3 = await fetch(`http://127.0.0.1:8000/api/department-tsa-analytics/${TeacherId}/`);
        const data3 = await response3.json();
        setHodData_section3(data3);

      } catch (error) {
        console.error('Error fetching HOD data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHodData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-gray-400">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">HOD Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* HOD Info Section */}
        <div className="mb-8">
          <HodInfo hodData={hodData_section1} />
        </div>

        {/* Department Analytics Section */}
        <div className="mb-8">
          <DepartmentAnalytics analyticsData={hodData_section2} />
        </div>

        {/* TSA Analytics Section */}
        <div className="mb-8">
          <TsaAnalytics tsaData={hodData_section3} />
        </div>
      </div>
    </div>
  );
};

export default HodDashboard; 