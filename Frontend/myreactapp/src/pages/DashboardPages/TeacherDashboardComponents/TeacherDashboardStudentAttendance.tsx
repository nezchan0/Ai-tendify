import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip,
  Divider,
 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  background: 'linear-gradient(145deg, #1a1a1a 0%, #252525 100%)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
}));


const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  padding: theme.spacing(2),
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
}));

const StudentCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  fontWeight: 600,
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
}));

const AttendanceCell = styled(TableCell)<{ status: 'present' | 'absent' | 'unknown' }>(
  ({ theme, status }) => ({
    textAlign: 'center',
    padding: theme.spacing(1),
    ...(status === 'present' && {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: theme.palette.success.main,
    }),
    ...(status === 'absent' && {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: theme.palette.error.main,
    }),
    ...(status === 'unknown' && {
      backgroundColor: 'rgba(156, 163, 175, 0.1)',
      color: theme.palette.text.secondary,
    }),
  })
);



const LegendContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

interface AttendanceData {
  student_id: string;
  student_name: string;
  attendance: {
    [date: string]: boolean | null;
  };
}

interface AttendanceResponse {
  teacher_id: string;
  tsa_id: number;
  subject_code: string;
  subject_name: string;
  class_id: string | null;
  is_lab: string;
  is_elective: string;
  dates: string[];
  attendance_data: AttendanceData[];
}

interface StoredData {
  teacherId: string;
  tsaId: number;
  subjectCode: string;
  subjectName: string;
}

const TeacherDashboardStudentAttendance: React.FC = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse | null>(null);
  const [storedData, setStoredData] = useState<StoredData | null>(null);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedDataString = sessionStorage.getItem('attendanceViewData');
    
    if (!storedDataString) {
      setError('No attendance data available. Please return to the courses page.');
      setLoading(false);
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedDataString) as StoredData;
      setStoredData(parsedData);
      
      // Fetch attendance data using the stored IDs
      const fetchAttendanceData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/teacher-attendance/${parsedData.teacherId}/${parsedData.tsaId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
          }
          const data = await response.json();
          setAttendanceData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAttendanceData();
    } catch (err) {
      setError('Invalid data format');
      setLoading(false);
    }
  }, []);

  const exportToCSV = () => {
    if (!attendanceData) return;

    const headers = ['Student ID', 'Student Name', ...attendanceData.dates];
    const rows = attendanceData.attendance_data.map(student => [
      student.student_id,
      student.student_name,
      ...attendanceData.dates.map(date => student.attendance[date] ? 'Present' : 'Absent')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${attendanceData.subject_code}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, p: 3, borderRadius: 2 }}>
        {error}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)} 
          sx={{ ml: 2 }}
        >
          Go Back
        </Button>
      </Alert>
    );
  }

  if (!attendanceData) {
    return (
      <Alert severity="info" sx={{ mt: 2, p: 3, borderRadius: 2 }}>
        No attendance data available
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)} 
          sx={{ ml: 2 }}
        >
          Go Back
        </Button>
      </Alert>
    );
  }

  // Calculate attendance statistics
  const calculateStudentStats = (student: AttendanceData) => {
    const totalClasses = attendanceData.dates.length;
    const attendedClasses = attendanceData.dates.filter(date => student.attendance[date] === true).length;
    const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    
    return {
      attendedClasses,
      totalClasses,
      attendancePercentage: attendancePercentage.toFixed(1)
    };
  };

  return (
    <StyledPaper>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={() => navigate(-1)} 
            color="primary"
            sx={{ 
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {attendanceData.subject_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {attendanceData.subject_code} • Class: {attendanceData.class_id || 'N/A'}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Tooltip title="Export to CSV">
            <IconButton 
              onClick={exportToCSV} 
              color="primary"
              sx={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' }
              }}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton 
              onClick={handlePrint} 
              color="primary"
              sx={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' }
              }}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <TableContainer sx={{ 
        borderRadius: 2, 
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        maxHeight: 'calc(100vh - 250px)',
      }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <HeaderCell>Student ID</HeaderCell>
              <HeaderCell>Student Name</HeaderCell>
              {attendanceData.dates.map((date) => (
                <HeaderCell key={date} align="center">
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </HeaderCell>
              ))}
              <HeaderCell align="center">Attendance %</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.attendance_data.map((student) => {
              const stats = calculateStudentStats(student);
              
              return (
                <TableRow key={student.student_id} hover>
                  <StudentCell>{student.student_id}</StudentCell>
                  <StudentCell>{student.student_name}</StudentCell>
                  {attendanceData.dates.map((date) => (
                    <AttendanceCell 
                      key={date} 
                      status={
                        student.attendance[date] === null 
                          ? 'unknown' 
                          : student.attendance[date] 
                            ? 'present' 
                            : 'absent'
                      }
                    >
                      {student.attendance[date] === null ? (
                        <HelpOutlineIcon fontSize="small" />
                      ) : student.attendance[date] ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : (
                        <CancelIcon fontSize="small" />
                      )}
                    </AttendanceCell>
                  ))}
                  <TableCell align="center">
                    <Chip 
                      label={`${stats.attendancePercentage}%`}
                      color={
                        parseFloat(stats.attendancePercentage) >= 75
                          ? 'success' 
                          : parseFloat(stats.attendancePercentage) >= 50 
                            ? 'warning' 
                            : 'error'
                      }
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <LegendContainer>
        <LegendItem>
          <CheckCircleIcon color="success" fontSize="small" />
          <Typography variant="body2">Present</Typography>
        </LegendItem>
        <LegendItem>
          <CancelIcon color="error" fontSize="small" />
          <Typography variant="body2">Absent</Typography>
        </LegendItem>
        <LegendItem>
          <HelpOutlineIcon color="action" fontSize="small" />
          <Typography variant="body2">No Record</Typography>
        </LegendItem>
      </LegendContainer>
    </StyledPaper>
  );
};

export default TeacherDashboardStudentAttendance;