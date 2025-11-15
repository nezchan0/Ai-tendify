import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface Student {
  student_id: string;
  student_name: string;
}

interface LocationState {
  tsaId: number;
  classId: string;
  date: string;
  day: string;
  sessionId: string;
  students: Student[];
}

const MarkAttendance = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { tsaId, classId, date, day, sessionId, students } = state as LocationState;
  
  const [presentStudents, setPresentStudents] = useState<Student[]>(students);
  const [absentStudents, setAbsentStudents] = useState<Student[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Debug log to check student data
  useEffect(() => {
    console.log('Students data:', students);
    console.log('Present students:', presentStudents);
  }, [students, presentStudents]);

  const toggleStudent = (student: Student) => {
    if (presentStudents.includes(student)) {
      setPresentStudents(prev => prev.filter(s => s !== student));
      setAbsentStudents(prev => [...prev, student]);
    } else {
      setAbsentStudents(prev => prev.filter(s => s !== student));
      setPresentStudents(prev => [...prev, student]);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    // Convert FileList to Array and filter for images
    const newFiles = Array.from(files).filter(file => 
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
    );
    
    // Check if adding these files would exceed the limit
    if (selectedImages.length + newFiles.length > 5) {
      setNotification({
        open: true,
        message: 'You can only upload a maximum of 5 images',
        severity: 'error'
      });
      return;
    }
    
    // Add new files to selected images
    setSelectedImages(prev => [...prev, ...newFiles]);
    
    // Create preview URLs for the new images
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const processImages = async () => {
    if (selectedImages.length < 1) {
      setNotification({
        open: true,
        message: 'Please upload at least 1 image',
        severity: 'error'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Process each image one by one
      const results = [];
      
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const formData = new FormData();
        formData.append('image', image);
        formData.append('tsa_id', tsaId.toString());
        
        const response = await fetch('http://127.0.0.1:8000/api/group-photo/', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Failed to process image ${i+1}: ${response.statusText}`);
        }
        
        const result = await response.json();
        results.push(result);
        
        // Update notification to show progress
        setNotification({
          open: true,
          message: `Processed image ${i+1}/${selectedImages.length}`,
          severity: 'info'
        });
      }
      
      // Combine results from all images
      const allIdentifiedStudents = new Map();
      
      results.forEach(result => {
        if (result.identified_students) {
          result.identified_students.forEach((student: any) => {
            if (!allIdentifiedStudents.has(student.id)) {
              allIdentifiedStudents.set(student.id, {
                student_id: student.id,
                student_name: student.name,
                detection_count: student.detection_count
              });
            } else {
              // Update detection count if student was identified in multiple images
              const existing = allIdentifiedStudents.get(student.id);
              existing.detection_count += student.detection_count;
            }
          });
        }
      });
      
      // Convert to array and sort by detection count (most detected first)
      const identifiedStudents = Array.from(allIdentifiedStudents.values())
        .sort((a, b) => b.detection_count - a.detection_count);
      
      // Update present students with identified students
      setPresentStudents(identifiedStudents);
      
      // Update absent students (students not identified in any image)
      const identifiedIds = new Set(identifiedStudents.map(s => s.student_id));
      const absent = students.filter(s => !identifiedIds.has(s.student_id));
      setAbsentStudents(absent);
      
      setNotification({
        open: true,
        message: `Successfully processed ${selectedImages.length} images. Identified ${identifiedStudents.length} students.`,
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error processing images:', error);
      setNotification({
        open: true,
        message: `Error processing images: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  const handleSubmit = async () => {
    const attendanceData = presentStudents.map(student => ({
        student_id: student.student_id,
        status: true
      })).concat(absentStudents.map(student => ({
        student_id: student.student_id,
        status: false
      })));
      
    try {
      const response = await fetch('http://127.0.0.1:8000/api/mark-attendance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Date: date,
          Day: day,
          Session_ID: sessionId,
          Class_ID: classId,
          TSA_ID: tsaId,
          attendance_data: attendanceData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit attendance');
      }

      alert('Attendance Submitted Successfully!');
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/teacher/dashboard')} 
          sx={{ mr: 2, color: theme.palette.primary.main }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Mark Attendance
        </Typography>
      </Box>

      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardHeader 
          title="Session Information" 
          sx={{ 
            bgcolor: theme.palette.primary.main, 
            color: 'white',
            '& .MuiCardHeader-title': { fontWeight: 'bold' }
          }}
        />
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            '& > *': { 
              flex: '1 1 200px',
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 16px)' }
            }
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Date</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{date}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Day</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{day}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Session ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{sessionId}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Class ID</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{classId}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardHeader 
          title="Upload Classroom Photos" 
          subheader="Upload 2-5 images of the class for facial recognition"
          sx={{ 
            bgcolor: theme.palette.primary.light, 
            color: theme.palette.primary.contrastText,
            '& .MuiCardHeader-title': { fontWeight: 'bold' }
          }}
        />
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              multiple
              type="file"
              onChange={handleImageChange}
              disabled={selectedImages.length >= 5 || isProcessing}
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={selectedImages.length >= 5 || isProcessing}
                sx={{ mr: 2 }}
              >
                Upload Images
              </Button>
            </label>
            <Button
              variant="outlined"
              color="primary"
              onClick={processImages}
              disabled={selectedImages.length < 1 || isProcessing}
              startIcon={isProcessing ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {isProcessing ? 'Processing...' : 'Process Images'}
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedImages.length}/5 images selected. Upload at least 2 images for better recognition.
            </Typography>
          </Box>
          
          {imagePreviewUrls.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              mt: 2
            }}>
              {imagePreviewUrls.map((url, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    position: 'relative',
                    width: 150,
                    height: 150,
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 1
                  }}
                >
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                    onClick={() => removeImage(index)}
                    disabled={isProcessing}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Present Students ({presentStudents.length})
                </Typography>
              </Box>
            }
            sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.dark }}
          />
          <CardContent sx={{ p: 0 }}>
            {presentStudents && presentStudents.length > 0 ? (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {presentStudents.map((student) => (
                  <ListItem 
                    key={student.student_id} 
                    onClick={() => toggleStudent(student)}
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { bgcolor: theme.palette.action.hover },
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={student.student_name || 'Unknown'} 
                      secondary={`ID: ${student.student_id || 'No ID'}`}
                    />
                    <Tooltip title="Mark as Absent">
                      <IconButton edge="end" aria-label="mark as absent">
                        <CancelIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No students marked as present</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
          <CardHeader 
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CancelIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Absent Students ({absentStudents.length})
                </Typography>
              </Box>
            }
            sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.dark }}
          />
          <CardContent sx={{ p: 0 }}>
            {absentStudents && absentStudents.length > 0 ? (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {absentStudents.map((student) => (
                  <ListItem 
                    key={student.student_id} 
                    onClick={() => toggleStudent(student)}
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { bgcolor: theme.palette.action.hover },
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.grey[500] }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={student.student_name || 'Unknown'} 
                      secondary={`ID: ${student.student_id || 'No ID'}`}
                    />
                    <Tooltip title="Mark as Present">
                      <IconButton edge="end" aria-label="mark as present">
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No students marked as absent</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          size="large"
          startIcon={<SendIcon />}
          sx={{ 
            px: 4, 
            py: 1.5, 
            borderRadius: 2,
            boxShadow: 3,
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Submit Attendance
        </Button>
      </Box>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MarkAttendance;
