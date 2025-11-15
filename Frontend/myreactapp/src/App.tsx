import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import StudentLoginPage from './pages/LoginPages/StudentLoginPage';
import TeacherLoginPage from './pages/LoginPages/TeacherLoginPage';
import HodLoginPage from './pages/LoginPages/HodLoginPage';
import AdminLoginPage from './pages/LoginPages/AdminLoginPage';
import StudentDashboard from './pages/DashboardPages/StudentDashboard';
import TeacherDashboard from './pages/DashboardPages/TeacherDashboard';
import HodDashboard from './pages/DashboardPages/HodDashboard';
import TeacherDashboardStudentAttendance from './pages/DashboardPages/TeacherDashboardComponents/TeacherDashboardStudentAttendance';
import MarkAttendance from './pages/DashboardPages/TeacherDashboardComponents/MarkAttendance';
// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo color
    },
    secondary: {
      main: '#8b5cf6', // Purple color
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="bg-[#0A0A0A] min-h-screen text-white">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Role-based login pages */}
            <Route path="/login/student" element={<StudentLoginPage />} />
            <Route path="/login/teacher" element={<TeacherLoginPage />} />
            <Route path="/login/hod" element={<HodLoginPage />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />

            {/* Role-based dashboard pages */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/hod/dashboard" element={<HodDashboard />} />
            
            {/* Teacher attendance page */}
            <Route path="/teacher-attendance" element={<TeacherDashboardStudentAttendance />} />
            <Route path="/teacher/mark-attendance" element={<MarkAttendance />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
