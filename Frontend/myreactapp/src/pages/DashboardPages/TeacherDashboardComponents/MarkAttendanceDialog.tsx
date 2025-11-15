import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import dayjs from 'dayjs';

interface MarkAttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  tsaId: number;
  classId: string;
  sessionIds: string[];
  onFinalize: (finalData: {
    date: string;
    day: string;
    sessionId: string;
  }) => void;
}

const timeslots = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P12", "P34", "P56", "P67"];

const MarkAttendanceDialog: React.FC<MarkAttendanceDialogProps> = ({ open, onClose, tsaId, classId, sessionIds, onFinalize }) => {
  const today = dayjs();
  const [date, _setDate] = useState(today.format('YYYY-MM-DD'));
  const [day, _setDay] = useState(today.format('dddd').toUpperCase());
  const [mode, setMode] = useState<'regular' | 'extra'>('regular');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedslot,setSelectedslot] = useState('');
  useEffect(() => {
    if (sessionIds.length === 0 && mode === 'regular') {
      setMode('extra');
    }
  }, [sessionIds, mode]);
  
  const handleSubmit = () => {
    onFinalize({
      date,
      day,
      sessionId: selectedSession
    });
    onClose();
  };

  const generateExtraSessionId = (timeSlotId: string) => {
    const dayShort = day.slice(0, 3).toUpperCase();
    return `X${dayShort}${timeSlotId}`;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Finalize Attendance Details</DialogTitle>
      <DialogContent>
        <TextField label="Date" value={date} fullWidth margin="normal" disabled />
        <TextField label="Day" value={day} fullWidth margin="normal" disabled />

        <FormControl component="fieldset" fullWidth margin="normal">
        <RadioGroup value={mode} onChange={(e) => setMode(e.target.value as 'regular' | 'extra')} row>
            <FormControlLabel
                value="regular"
                control={<Radio />}
                label="Regular Class"
                disabled={sessionIds.length === 0}  // ⬅️ DISABLE if no sessions
            />
            <FormControlLabel
                value="extra"
                control={<Radio />}
                label="Extra Class"
            />
            </RadioGroup>

        </FormControl>

        {mode === 'regular' ? (
          <FormControl fullWidth margin="normal">
          <InputLabel>Select Session ID</InputLabel>
          <Select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} disabled={sessionIds.length === 0}>
            {sessionIds.length > 0 ? (
              sessionIds.map((sessionId) => (
                <MenuItem key={sessionId} value={sessionId}>{sessionId}</MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No sessions available
              </MenuItem>
            )}
          </Select>
        </FormControl>
        
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Time Slot</InputLabel>
            <Select value={selectedslot}   onChange={(e) => {
                                            const selectedValue = e.target.value;
                                            setSelectedSession(generateExtraSessionId(selectedValue)); 
                                            setSelectedslot(selectedValue); 
                                        }}>
              {timeslots.map((slot) => (
                <MenuItem key={slot} value={slot}>{slot}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!selectedSession}>Proceed</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MarkAttendanceDialog;
