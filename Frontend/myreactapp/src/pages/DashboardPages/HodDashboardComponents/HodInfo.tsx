import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';

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

const InfoIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
}));

interface HodInfoProps {
  hodData: {
    Teacher_ID: string;
    Teacher_Name: string;
    Initials: string;
    Branch_ID: string;
    Branch_Name: string;
    Teacher_Email: string;
  };
}

const HodInfo: React.FC<HodInfoProps> = ({ hodData }) => {
  if (!hodData) return null;

  return (
    <StyledPaper>
      <Box display="flex" mb={3}>
        {/* Left side: Avatar + Name + ID */}
        <Box flex="3" display="flex" alignItems="center">
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 2,
            }}
          >
            {hodData.Initials}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {hodData.Teacher_Name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {hodData.Teacher_ID}
            </Typography>
          </Box>
        </Box>

        {/* Right side: Email + Branch (with icons) */}
        <Box flex="7" display="flex" flexDirection="column" justifyContent="center">
          <Box display="flex" alignItems="center" mb={1}>
            <InfoIcon>
              <EmailIcon />
            </InfoIcon>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {hodData.Teacher_Email}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <InfoIcon>
              <SchoolIcon />
            </InfoIcon>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Branch
              </Typography>
              <Typography variant="body1">
                {hodData.Branch_Name} ({hodData.Branch_ID})
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
    </StyledPaper>
  );
};

export default HodInfo; 