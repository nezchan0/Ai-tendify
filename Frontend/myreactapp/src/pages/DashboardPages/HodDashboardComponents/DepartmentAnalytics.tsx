import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '15px',
  background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  height: '100%',
}));

const StatIcon = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontSize: '2.5rem',
}));

interface DepartmentAnalyticsProps {
  analyticsData: {
    branch_id: string;
    branch_name: string;
    total_students: number;
    semester_analytics: {
      [key: string]: {
        total_students: number;
        attendance_percentage: number;
      };
    };
    class_analytics: {
      [key: string]: {
        total_students: number;
        attendance_percentage: number;
      };
    };
  };
}

const DepartmentAnalytics: React.FC<DepartmentAnalyticsProps> = ({ analyticsData }) => {
  if (!analyticsData) return null;

  // Convert semester_analytics and class_analytics to arrays for easier rendering
  const semesterData = Object.entries(analyticsData.semester_analytics).map(([semester, data]) => ({
    semester,
    ...data,
  }));

  const classData = Object.entries(analyticsData.class_analytics).map(([classId, data]) => ({
    classId,
    ...data,
  }));

  return (
    <StyledPaper>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Department Analytics
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
          <StatCard>
            <StatIcon>
              <PeopleIcon fontSize="large" />
            </StatIcon>
            <Typography variant="h4" fontWeight="bold">
              {analyticsData.total_students}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Students
            </Typography>
          </StatCard>
        </Box>
        <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
          <StatCard>
            <StatIcon>
              <SchoolIcon fontSize="large" />
            </StatIcon>
            <Typography variant="h4" fontWeight="bold">
              {semesterData.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Semesters
            </Typography>
          </StatCard>
        </Box>
        <Box sx={{ flex: '1 1 30%', minWidth: '250px' }}>
          <StatCard>
            <StatIcon>
              <TrendingUpIcon fontSize="large" />
            </StatIcon>
            <Typography variant="h4" fontWeight="bold">
              {classData.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Classes
            </Typography>
          </StatCard>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Semester Analytics Table */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Semester-wise Analytics
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4, background: 'transparent', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Semester</TableCell>
              <TableCell align="right">Total Students</TableCell>
              <TableCell align="right">Attendance %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {semesterData.map((semester) => (
              <TableRow key={semester.semester}>
                <TableCell component="th" scope="row">
                  Semester {semester.semester}
                </TableCell>
                <TableCell align="right">{semester.total_students}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Box
                      sx={{
                        width: '100%',
                        mr: 1,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${semester.attendance_percentage}%`,
                          height: '100%',
                          borderRadius: 5,
                          bgcolor: 'primary.main',
                        }}
                      />
                    </Box>
                    {semester.attendance_percentage.toFixed(1)}%
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Class Analytics Table */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Class-wise Analytics
      </Typography>
      <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class ID</TableCell>
              <TableCell align="right">Total Students</TableCell>
              <TableCell align="right">Attendance %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classData.map((classItem) => (
              <TableRow key={classItem.classId}>
                <TableCell component="th" scope="row">
                  {classItem.classId}
                </TableCell>
                <TableCell align="right">{classItem.total_students}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Box
                      sx={{
                        width: '100%',
                        mr: 1,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${classItem.attendance_percentage}%`,
                          height: '100%',
                          borderRadius: 5,
                          bgcolor: 'primary.main',
                        }}
                      />
                    </Box>
                    {classItem.attendance_percentage.toFixed(1)}%
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledPaper>
  );
};

export default DepartmentAnalytics; 