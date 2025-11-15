import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
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

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface TsaAnalyticsProps {
  tsaData: {
    branch_id: string;
    branch_name: string;
    tsa_analytics: Array<{
      tsa_id: number;
      semester: string;
      teacher_id: string;
      teacher_name: string;
      subject_code: string;
      subject_name: string;
      class_id: string | null;
      is_lab: boolean;
      is_elective: boolean;
      total_students: number;
      attendance_percentage: number;
    }>;
  };
}

const TsaAnalytics: React.FC<TsaAnalyticsProps> = ({ tsaData }) => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  useEffect(() => {
    if (tsaData && tsaData.tsa_analytics) {
      // Extract unique values for filters
      const uniqueSemesters = [...new Set(tsaData.tsa_analytics.map(item => item.semester))];
      const uniqueTeachers = [...new Set(tsaData.tsa_analytics.map(item => item.teacher_id))];
      const uniqueClasses = [...new Set(tsaData.tsa_analytics.map(item => item.class_id).filter(Boolean) as string[])];
      
      setSemesters(uniqueSemesters);
      setTeachers(uniqueTeachers);
      setClasses(uniqueClasses);
      
      // Set initial filtered data
      setFilteredData(tsaData.tsa_analytics);
    }
  }, [tsaData]);

  useEffect(() => {
    if (tsaData && tsaData.tsa_analytics) {
      let filtered = [...tsaData.tsa_analytics];
      
      if (selectedSemester) {
        filtered = filtered.filter(item => item.semester === selectedSemester);
      }
      
      if (selectedTeacher) {
        filtered = filtered.filter(item => item.teacher_id === selectedTeacher);
      }
      
      if (selectedClass) {
        filtered = filtered.filter(item => item.class_id === selectedClass);
      }
      
      setFilteredData(filtered);
    }
  }, [tsaData, selectedSemester, selectedTeacher, selectedClass]);

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
  };

  const handleTeacherChange = (event: SelectChangeEvent) => {
    setSelectedTeacher(event.target.value);
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  };

  // Prepare data for charts
  const attendanceData = filteredData.map(item => ({
    name: `${item.subject_code} (${item.class_id || 'N/A'})`,
    attendance: item.attendance_percentage,
  }));

  // Replace teacher performance data with attendance distribution data
  const attendanceDistributionData = [
    { name: 'High Attendance (90-100%)', value: filteredData.filter(item => item.attendance_percentage >= 90).length },
    { name: 'Good Attendance (80-89%)', value: filteredData.filter(item => item.attendance_percentage >= 80 && item.attendance_percentage < 90).length },
    { name: 'Average Attendance (70-79%)', value: filteredData.filter(item => item.attendance_percentage >= 70 && item.attendance_percentage < 80).length },
    { name: 'Below Average (60-69%)', value: filteredData.filter(item => item.attendance_percentage >= 60 && item.attendance_percentage < 70).length },
    { name: 'Poor Attendance (<60%)', value: filteredData.filter(item => item.attendance_percentage < 60).length },
  ];

  const semesterData = filteredData.reduce((acc: any, item) => {
    const existingSemester = acc.find((s: any) => s.name === `Semester ${item.semester}`);
    if (existingSemester) {
      existingSemester.attendance += item.attendance_percentage;
      existingSemester.count += 1;
    } else {
      acc.push({
        name: `Semester ${item.semester}`,
        attendance: item.attendance_percentage,
        count: 1,
      });
    }
    return acc;
  }, []).map((item: any) => ({
    name: item.name,
    attendance: item.attendance / item.count,
  }));

  if (!tsaData) return null;

  return (
    <StyledPaper>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        TSA Analytics
      </Typography>

      {/* Filters */}
      <FilterContainer>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="semester-filter-label">Semester</InputLabel>
          <Select
            labelId="semester-filter-label"
            value={selectedSemester}
            label="Semester"
            onChange={handleSemesterChange}
          >
            <MenuItem value="">All Semesters</MenuItem>
            {semesters.map((semester) => (
              <MenuItem key={semester} value={semester}>
                Semester {semester}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="teacher-filter-label">Teacher</InputLabel>
          <Select
            labelId="teacher-filter-label"
            value={selectedTeacher}
            label="Teacher"
            onChange={handleTeacherChange}
          >
            <MenuItem value="">All Teachers</MenuItem>
            {teachers.map((teacherId) => {
              const teacher = tsaData.tsa_analytics.find(item => item.teacher_id === teacherId);
              return (
                <MenuItem key={teacherId} value={teacherId}>
                  {teacher?.teacher_name} ({teacherId})
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="class-filter-label">Class</InputLabel>
          <Select
            labelId="class-filter-label"
            value={selectedClass}
            label="Class"
            onChange={handleClassChange}
          >
            <MenuItem value="">All Classes</MenuItem>
            {classes.map((classId) => (
              <MenuItem key={classId} value={classId}>
                {classId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterContainer>

      {/* TSA Analytics Table */}
      <TableContainer component={Paper} sx={{ mb: 4, background: 'transparent', boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>TSA ID</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Class</TableCell>
              <TableCell align="right">Students</TableCell>
              <TableCell align="right">Attendance %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((tsa) => (
              <TableRow key={tsa.tsa_id}>
                <TableCell>{tsa.tsa_id}</TableCell>
                <TableCell> {tsa.semester}</TableCell>
                <TableCell>{tsa.teacher_name} ({tsa.teacher_id})</TableCell>
                <TableCell>
                  {tsa.subject_code} - {tsa.subject_name}
                  {tsa.is_lab && ' (Lab)'}
                  {tsa.is_elective && ' (Elective)'}
                </TableCell>
                <TableCell>{tsa.class_id || 'N/A'}</TableCell>
                <TableCell align="right">{tsa.total_students}</TableCell>
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
                          width: `${tsa.attendance_percentage}%`,
                          height: '100%',
                          borderRadius: 5,
                          bgcolor: 'primary.main',
                        }}
                      />
                    </Box>
                    {tsa.attendance_percentage.toFixed(1)}%
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Charts */}
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Visual Analytics
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Subject Attendance Chart */}
        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <Paper sx={{ p: 2, background: 'transparent', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Subject-wise Attendance
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" name="Attendance %" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Teacher Performance Chart - REPLACED with Attendance Distribution Chart */}
        <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
          <Paper sx={{ p: 2, background: 'transparent', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Attendance Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {attendanceDistributionData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Semester Performance Chart */}
        <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
          <Paper sx={{ p: 2, background: 'transparent', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Semester Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={semesterData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" name="Attendance %" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default TsaAnalytics; 