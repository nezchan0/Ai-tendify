import { useNavigate} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Chip,
  Drawer,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ClassIcon from '@mui/icons-material/Class';

import MenuIcon from '@mui/icons-material/Menu';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #1a1a1a 0%, #252525 100%)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const Header = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
  color: 'white',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: '0 0 15px 15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  color: theme.palette.text.primary,
  fontWeight: 500,
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  height: 500,
  width: '100%',
  marginTop: theme.spacing(3),
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#6366f1'];

interface StudentInfo {
  Student_ID: string;
  Student_Name: string;
  Branch_ID: string;
  Branch_Name: string;
  Graduation_Batch: number;
  Student_Email: string;
  Parents_Contact: string;
  Image_URL: string;
  Current_Class: {
    Semester: number;
    Section: string;
    Class_ID: string;
  };
}

interface SubjectInfo {
  Subject_Code: string;
  Subject_Name: string;
  Teacher_Name: string;
  TSA_ID: number;
  Attendance: {
    Total_Classes: number;
    Classes_Attended: number;
    Attendance_Percentage: number;
    Class_Average_Attendance_Percentage: number;
  };
}

type ChartType = 'bar' | 'pie' | 'line';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<{
    Student_Info: StudentInfo;
    Enrolled_Subjects: SubjectInfo[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const tokenString = localStorage.getItem('token');
        if (!tokenString) {
          console.error('No token found');
          return;
        }
        
        const token = JSON.parse(tokenString);
        const studentId = token.user_id;
        
        const response = await fetch(`http://127.0.0.1:8000/api/student-info/${studentId}/`);
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!studentData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          Failed to load student data
        </Typography>
      </Box>
    );
  }

  const { Student_Info, Enrolled_Subjects } = studentData;

  // Calculate overall attendance
  const totalClasses = Enrolled_Subjects.reduce((sum, subject) => sum + subject.Attendance.Total_Classes, 0);
  const totalAttended = Enrolled_Subjects.reduce((sum, subject) => sum + subject.Attendance.Classes_Attended, 0);
  const overallAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  // Prepare data for charts
  const attendanceData = Enrolled_Subjects
    .filter(subject => subject.Attendance.Total_Classes > 0)
    .map(subject => ({
      name: subject.Subject_Code,
      individual: subject.Attendance.Attendance_Percentage,
      classAverage: subject.Attendance.Class_Average_Attendance_Percentage,
    }));

  const pieChartData = Enrolled_Subjects
    .filter(subject => subject.Attendance.Total_Classes > 0)
    .map(subject => ({
      name: subject.Subject_Code,
      value: subject.Attendance.Attendance_Percentage,
    }));

  const lineChartData = Enrolled_Subjects
    .filter(subject => subject.Attendance.Total_Classes > 0)
    .map(subject => ({
      name: subject.Subject_Code,
      individual: subject.Attendance.Attendance_Percentage,
      classAverage: subject.Attendance.Class_Average_Attendance_Percentage,
    }));

  const renderChart = () => {
    switch (selectedChart) {
      case 'bar':
        return (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="individual" name="Your Attendance" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="classAverage" name="Class Average" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      case 'pie':
        return (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      case 'line':
        return (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="individual" 
                  name="Your Attendance" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="classAverage" 
                  name="Class Average" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  const chartSidebar = (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Chart Options</Typography>
        {isMobile && (
          <IconButton onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box 
          onClick={() => setSelectedChart('bar')}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 1,
            cursor: 'pointer',
            bgcolor: selectedChart === 'bar' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.1)',
            }
          }}
        >
          <BarChartIcon color={selectedChart === 'bar' ? 'primary' : 'inherit'} sx={{ mr: 2 }} />
          <ListItemText primary="Bar Chart" />
        </Box>
        <Box 
          onClick={() => setSelectedChart('pie')}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 1,
            cursor: 'pointer',
            bgcolor: selectedChart === 'pie' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.1)',
            }
          }}
        >
          <PieChartIcon color={selectedChart === 'pie' ? 'primary' : 'inherit'} sx={{ mr: 2 }} />
          <ListItemText primary="Pie Chart" />
        </Box>
        <Box 
          onClick={() => setSelectedChart('line')}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderRadius: 1,
            cursor: 'pointer',
            bgcolor: selectedChart === 'line' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.1)',
            }
          }}
        >
          <ShowChartIcon color={selectedChart === 'line' ? 'primary' : 'inherit'} sx={{ mr: 2 }} />
          <ListItemText primary="Line Chart" />
        </Box>
      </Box>
    </Box>
  );
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login/student');
    
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon sx={{ fontSize: 40 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Student Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
  <Button 
    variant="outlined" 
    startIcon={<LogoutIcon />}
    onClick={handleLogout}
    sx={{ 
      borderColor: 'purple',
      color: 'purple',
      backgroundColor: 'white',
      '& .MuiButton-startIcon svg': {
        color: 'purple', // icon color
      },
      '&:hover': {
        backgroundColor: 'purple',
        color: 'white',
        borderColor: 'purple',
        '& .MuiButton-startIcon svg': {
          color: 'white', // icon color on hover
        },
      },
    }}
  >
    Logout
  </Button>

  <IconButton 
    sx={{ display: { md: 'none' }, color: 'white' }}
    onClick={() => setSidebarOpen(!sidebarOpen)}
  >
    <MenuIcon />
  </IconButton>
</Box>

          </Box>
        </Container>
      </Header>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        {/* Section 1: Student Details */}
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          Student Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 5 }}>
          <Box sx={{ width: { xs: '100%', md: '33%' } }}>
            <StyledPaper>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Avatar
                  src={Student_Info.Image_URL}
                  sx={{ width: 200, height: 200, border: '4px solid #6366f1', mb: 3 }}
                />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {Student_Info.Student_Name}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  {Student_Info.Student_ID}
                </Typography>
                <Divider sx={{ width: '100%', my: 3 }} />
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6">
                      {Student_Info.Branch_Name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ClassIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6">
                      Semester {Student_Info.Current_Class.Semester} - Section {Student_Info.Current_Class.Section}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h6">
                      Batch: {Student_Info.Graduation_Batch}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StyledPaper>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '67%' } }}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <EmailIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" color="text.secondary">Email</Typography>
                      <Typography variant="h6">{Student_Info.Student_Email}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PhoneIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" color="text.secondary">Parent's Contact</Typography>
                      <Typography variant="h6">{Student_Info.Parents_Contact}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Attendance Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ width: { xs: '100%', sm: '33%' } }}>
                  <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 3 }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#6366f1', mb: 1 }}>
                      {overallAttendance.toFixed(1)}%
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Overall Attendance</Typography>
                  </Box>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '33%' } }}>
                  <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'rgba(139, 92, 246, 0.1)', borderRadius: 3 }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#8b5cf6', mb: 1 }}>
                      {totalAttended}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Classes Attended</Typography>
                  </Box>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '33%' } }}>
                  <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 3 }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#6366f1', mb: 1 }}>
                      {totalClasses}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">Total Classes</Typography>
                  </Box>
                </Box>
              </Box>
            </StyledPaper>
          </Box>
        </Box>

        {/* Section 2: Course Information */}
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          Enrolled Courses
        </Typography>
        <Box sx={{ mb: 5 }}>
          <StyledPaper>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Subject Code</StyledTableCell>
                    <StyledTableCell>Subject Name</StyledTableCell>
                    <StyledTableCell>Teacher</StyledTableCell>
                    <StyledTableCell align="right">Classes Attended</StyledTableCell>
                    <StyledTableCell align="right">Total Classes</StyledTableCell>
                    <StyledTableCell align="right">Attendance %</StyledTableCell>
                    <StyledTableCell align="right">Class Average %</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Enrolled_Subjects.map((subject) => (
                    <TableRow key={subject.TSA_ID} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                      <StyledTableCell>{subject.Subject_Code}</StyledTableCell>
                      <StyledTableCell>{subject.Subject_Name}</StyledTableCell>
                      <StyledTableCell>{subject.Teacher_Name}</StyledTableCell>
                      <StyledTableCell align="right">{subject.Attendance.Classes_Attended}</StyledTableCell>
                      <StyledTableCell align="right">{subject.Attendance.Total_Classes}</StyledTableCell>
                      <StyledTableCell align="right">
                        <Chip 
                          label={`${subject.Attendance.Attendance_Percentage.toFixed(1)}%`}
                          color={subject.Attendance.Attendance_Percentage >= 75 ? 'success' : 'error'}
                          size="medium"
                        />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {subject.Attendance.Class_Average_Attendance_Percentage.toFixed(1)}%
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Box>

        {/* Section 3: Charts */}
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
          Attendance Analytics
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '25%' } }}>
            {isMobile ? (
              <Drawer
                anchor="right"
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              >
                {chartSidebar}
              </Drawer>
            ) : (
              <StyledPaper>
                {chartSidebar}
              </StyledPaper>
            )}
          </Box>
          <Box sx={{ width: { xs: '100%', md: '75%' } }}>
            <StyledPaper>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                {selectedChart === 'bar' ? 'Attendance Comparison' : 
                 selectedChart === 'pie' ? 'Attendance Distribution' : 
                 'Attendance Trends'}
              </Typography>
              {renderChart()}
            </StyledPaper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentDashboard; 