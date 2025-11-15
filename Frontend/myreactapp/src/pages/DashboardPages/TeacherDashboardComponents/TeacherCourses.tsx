import React, { useState } from 'react';
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
  IconButton,
  Tooltip,
  Button,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import MarkAttendanceDialog from './MarkAttendanceDialog';
// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledTableCell = styled(TableCell)(({ }) => ({
  fontWeight: 'bold',
}));

const AttendanceChip = styled(Chip)<{ attendance: number }>(({ theme, attendance }) => ({
  backgroundColor: attendance >= 75 ? theme.palette.success.light : 
                  attendance >= 60 ? theme.palette.warning.light : 
                  theme.palette.error.light,
  color: attendance >= 75 ? theme.palette.success.dark : 
         attendance >= 60 ? theme.palette.warning.dark : 
         theme.palette.error.dark,
}));

interface TeacherCoursesProps {
  coursesData: any[];
  teacherId: number;
}

const TeacherCourses: React.FC<TeacherCoursesProps> = ({ coursesData, teacherId }) => {
  const navigate = useNavigate();
  const [markAttendanceOpen, setMarkAttendanceOpen] = useState(false);
  const [selectedTSA, setSelectedTSA] = useState<number | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  if (!coursesData) return null;

  const handleViewAttendance = (tsaId: number) => {
    // Store the data in sessionStorage for security
    sessionStorage.setItem('attendanceViewData', JSON.stringify({
      teacherId,
      tsaId,
      subjectCode: coursesData.find(course => course.TSA_ID === tsaId)?.Subject_Code || '',
      subjectName: coursesData.find(course => course.TSA_ID === tsaId)?.Subject_Name || ''
    }));
    
    // Navigate to the attendance page without parameters
    navigate('/teacher-attendance');
  };

  const handleMarkAttendance = (tsaId: number, classId: string) => {
    setSelectedTSA(tsaId);
    setSelectedClassId(classId);
    setMarkAttendanceOpen(true);
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Courses Taught
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Subject</StyledTableCell>
              <StyledTableCell>Class</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Students</StyledTableCell>
              <StyledTableCell>Classes</StyledTableCell>
              <StyledTableCell>Attendance %</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coursesData.map((course, index) => (
              <TableRow key={index}>
                <StyledTableCell>
                  {course.Subject_Name}
                  <Typography variant="caption" color="text.secondary" display="block">
                    {course.Subject_Code}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>{course.Class_ID || 'N/A'}</StyledTableCell>
                <StyledTableCell>
                  <Box display="flex" gap={1}>
                    {course.Is_Lab === 'YES' && (
                      <Chip label="Lab" size="small" color="primary" />
                    )}
                    {course.Is_Elective === 'YES' && (
                      <Chip label="Elective" size="small" color="secondary" />
                    )}
                    {course.Is_Lab !== 'YES' && course.Is_Elective !== 'YES' && (
                      <Chip label="Regular" size="small" color="success" />
                    )}
                  </Box>
                </StyledTableCell>
                <StyledTableCell>{course.Statistics.Total_Students}</StyledTableCell>
                <StyledTableCell>{course.Statistics.Total_Classes}</StyledTableCell>
                <StyledTableCell>
                  <AttendanceChip
                    label={`${course.Statistics.Attendance_Percentage.toFixed(1)}%`}
                    attendance={course.Statistics.Attendance_Percentage}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Attendance Register">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewAttendance(course.TSA_ID)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleMarkAttendance(course.TSA_ID, course.Class_ID)}
                    >
                      Mark Attendance
                    </Button>
                  </Box>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        

      {selectedTSA && selectedClassId && (
  <MarkAttendanceDialog
    open={markAttendanceOpen}
    onClose={() => {
      setMarkAttendanceOpen(false);
      setSelectedTSA(null);
      setSelectedClassId(null);
    }}
    tsaId={selectedTSA}
    classId={selectedClassId}
    sessionIds={ (coursesData.find(course => course.TSA_ID === selectedTSA)?.Session_IDs || [])
      .filter((sessionId: string) => {
        const todayPrefix = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
        return sessionId.startsWith(todayPrefix);
      })}
    onFinalize={async ({ date, day, sessionId }) => {
      // Fetch students
      const response = await fetch(`http://127.0.0.1:8000/api/tsa-students/${selectedTSA}`);
      const studentsData = await response.json();

      // Navigate to mark attendance page
      navigate('/teacher/mark-attendance', {
        state: {
          tsaId: selectedTSA,
          classId: selectedClassId,
          date,
          day,
          sessionId,
          students: studentsData,
        }
      });
    }}
  />
)}

    </StyledPaper>
  );
};

export default TeacherCourses;
   