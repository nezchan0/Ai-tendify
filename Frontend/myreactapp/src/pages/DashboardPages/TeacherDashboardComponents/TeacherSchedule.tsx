import React from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
 
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  color: theme.palette.text.primary,
  fontWeight: 500,
}));

const AttendanceCell = styled(TableCell)<{ attendance: number }>(({ theme, attendance }) => {
  const getBackgroundColor = () => {
    if (attendance >= 75) return 'rgba(0, 200, 83, 0.2)';
    if (attendance >= 50) return 'rgba(255, 193, 7, 0.2)';
    return 'rgba(244, 67, 54, 0.2)';
  };

  return {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: theme.palette.text.primary,
    backgroundColor: getBackgroundColor(),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  };
});

const ChartContainer = styled(Box)(({ theme }) => ({
  height: 300,
  width: '100%',
  marginTop: theme.spacing(3),
}));

interface ScheduleItem {
  Day: string;
  Start_Time: string;
  End_Time: string;
  Is_Extra_Class: boolean;
  Class_ID: string;
  Subject_Code: string;
  Subject_Name: string;
  Room_Number: string | null;
  Is_Lab: string;
  Is_Elective: string;
  Attendance_Stats: {
    Total_Students: number;
    Total_Classes: number;
    Overall_Attendance_Percentage: number;
    Recent_Trend: {
      date: string;
      attendance_percentage: number;
    }[];
  };
}

interface TeacherScheduleProps {
  scheduleData: ScheduleItem[];
}

const TeacherSchedule: React.FC<TeacherScheduleProps> = ({ scheduleData }) => {
  const [selectedSession, setSelectedSession] = React.useState<ScheduleItem | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (!scheduleData) return null;

  const handleSessionClick = (session: ScheduleItem) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Teaching Schedule
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Day</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Subject</StyledTableCell>
              <StyledTableCell>Class</StyledTableCell>
              <StyledTableCell>Room</StyledTableCell>
              <StyledTableCell>Attendance Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scheduleData.map((session, index) => (
              <TableRow key={index}>
                <StyledTableCell>{session.Day}</StyledTableCell>
                <StyledTableCell>
                  {formatTime(session.Start_Time)} - {formatTime(session.End_Time)}
                  {session.Is_Extra_Class && (
                    <Typography variant="caption" color="error" display="block">
                      Extra Class
                    </Typography>
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  {session.Subject_Name}
                  <Typography variant="caption" color="text.secondary" display="block">
                    {session.Subject_Code}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>{session.Class_ID}</StyledTableCell>
                <StyledTableCell>{session.Room_Number || 'N/A'}</StyledTableCell>
                <AttendanceCell
                  attendance={session.Attendance_Stats.Overall_Attendance_Percentage}
                  onClick={() => handleSessionClick(session)}
                >
                  <Tooltip title="Click for detailed analytics">
                    <Typography>
                      {session.Attendance_Stats.Overall_Attendance_Percentage.toFixed(1)}%
                    </Typography>
                  </Tooltip>
                </AttendanceCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Session Analytics Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRadius: '15px',
          },
        }}
      >
        {selectedSession && (
          <>
             <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
  📚 {selectedSession.Subject_Name} - {selectedSession.Class_ID}
</DialogTitle>
<DialogContent>
  <Typography
    variant="subtitle2"
    color="text.secondary"
    sx={{ mb: 2 }}
  >
    {selectedSession.Day}, {formatTime(selectedSession.Start_Time)} - {formatTime(selectedSession.End_Time)}
  </Typography>

  {/* Attendance Statistics Section */}
  <Box mt={2} p={2} borderRadius={2} bgcolor="rgba(255,255,255,0.05)" display="flex" flexDirection="column" gap={1}>
    <Typography variant="h6" gutterBottom>
      📊 Attendance Statistics
    </Typography>
    <Typography>
      👥 Total Students: <strong>{selectedSession.Attendance_Stats.Total_Students}</strong>
    </Typography>
    <Typography>
      🏫 Total Classes: <strong>{selectedSession.Attendance_Stats.Total_Classes}</strong>
    </Typography>
    <Typography>
      ✅ Overall Attendance: <strong>{selectedSession.Attendance_Stats.Overall_Attendance_Percentage.toFixed(1)}%</strong>
    </Typography>
  </Box>

  {/* Attendance Trend Section */}
  <Box mt={4}>
    <Typography variant="h6" gutterBottom>
      📈 Recent Attendance Trend
    </Typography>
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={selectedSession.Attendance_Stats.Recent_Trend}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="date" stroke="white" />
          <YAxis stroke="white" />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#252525',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="attendance_percentage"
            name="Attendance %"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  </Box>
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseDialog} variant="contained" color="primary">
    Close
  </Button>
</DialogActions>

          </>
        )}
      </Dialog>
    </StyledPaper>
  );
};

export default TeacherSchedule; 