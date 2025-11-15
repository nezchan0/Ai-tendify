import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherInfo from './TeacherDashboardComponents/TeacherInfo';
import TeacherCourses from './TeacherDashboardComponents/TeacherCourses';
import TeacherSchedule from './TeacherDashboardComponents/TeacherSchedule';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string>('');
  const [teacherData_section1, setTeacherData_section1] = useState<any>(null);
  const [teacherData_section2, setTeacherData_section2] = useState<any>(null);
  const [teacherData_section3, setTeacherData_section3] = useState<any>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
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

        // Fetch teacher info
        const response1 = await fetch(`http://127.0.0.1:8000/api/teacher-info/${TeacherId}/`);
        const data1 = await response1.json();
        setTeacherData_section1(data1);

        // Fetch teacher courses
        const response2 = await fetch(`http://127.0.0.1:8000/api/teacher-analytics/${TeacherId}/`);
        const data2 = await response2.json();
        setTeacherData_section2(data2.analytics);

        // Fetch teacher schedule
        const response3 = await fetch(`http://127.0.0.1:8000/api/teacher-schedule/${TeacherId}/`);
        const data3 = await response3.json();
        setTeacherData_section3(data3.schedule);

      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
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
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
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
        
        {/* Teacher Info Section */}
        <div className="mb-8">
          <TeacherInfo teacherData={teacherData_section1} />
        </div>

        {/* Teacher Courses Section */}
        <div className="mb-8">
          <TeacherCourses coursesData={teacherData_section2} teacherId={teacherId} />
        </div>

        {/* Teacher Schedule Section */}
        <div className="mb-8">
          <TeacherSchedule scheduleData={teacherData_section3} />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 