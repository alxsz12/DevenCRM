import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  TextField, 
  Stack,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';
import { useContacts } from '../context/ContactContext';
import { styled } from '@mui/material/styles';

const ContactPill = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  paddingRight: theme.spacing(6), // Added padding for status indicator
  borderRadius: 32,
  marginBottom: theme.spacing(2),
  boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
  transition: 'all 0.3s ease',
  border: '1px solid #e0e0e0',
  position: 'relative', // Added for status indicator positioning
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
    borderColor: '#bdbdbd'
  }
}));

const StatusIndicator = styled('div')(({ color }) => ({
  width: 48,
  height: '100%',
  backgroundColor: color,
  position: 'absolute',
  right: 0,
  top: 0,
  borderTopRightRadius: 32,
  borderBottomRightRadius: 32,
  transition: 'background-color 0.3s'
}));

const getStatusColor = (daysSinceContact, reminderFrequency) => {
  const ratio = daysSinceContact / reminderFrequency;
  if (ratio <= 0.5) return '#4caf50'; // Green
  if (ratio <= 0.8) return '#ffeb3b'; // Yellow
  return '#f44336'; // Red
};

const ContactInfo = styled('div')({
  flex: 1
});

const ContactsPage = () => {  const { contacts, addContact, updateContactReminder, updateLastContacted, getDaysSinceLastContact } = useContacts();
  const [open, setOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    notes: [],
    reminder: { frequency: 7, unit: 'days' }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact(newContact);
    setNewContact({
      name: '',
      phone: '',
      email: '',
      notes: [],
      reminder: { frequency: 0, unit: 'days' }
    });
    setOpen(false);
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Contacts</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add New Contact</Button>
      </Stack>

      <Box>
        {contacts.map((contact) => {
          const daysSince = getDaysSinceLastContact(contact.lastContacted);
          const reminderDays = contact.reminder.frequency * (contact.reminder.unit === 'weeks' ? 7 : contact.reminder.unit === 'months' ? 30 : 1);
          
          return (
            <ContactPill key={contact.id} elevation={1}>
              <ContactInfo>
                <Stack direction="row" spacing={2} alignItems="center">
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>{contact.name}</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: '0.9rem' }}>{contact.phone}</Typography>
                    <Typography color="textSecondary" sx={{ fontSize: '0.9rem' }}>{contact.email}</Typography>
                  </div>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="textSecondary">
                      Last contacted: {daysSince} days ago
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      Reminder: Every {contact.reminder.frequency} {contact.reminder.unit}
                      <Button 
                        size="small" 
                        onClick={() => {
                          setSelectedContact(contact);
                          setReminderOpen(true);
                        }}
                        sx={{ ml: 1 }}
                      >
                        Change
                      </Button>
                    </Typography>
                  </Stack>
                </Stack>
              </ContactInfo>              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  onClick={() => {
                    updateLastContacted(contact.id);
                  }}
                  color="primary"
                  size="small"
                  sx={{ 
                    zIndex: 1,
                    mr: 1,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)'
                    }
                  }}
                >
                  <MessageIcon />
                </IconButton>
                <StatusIndicator color={getStatusColor(daysSince, reminderDays)} />
              </Box>
            </ContactPill>
          );
        })}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Add New Contact</Typography>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              required
            />
            <TextField
              label="Phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            />
            <Button type="submit" variant="contained">Add Contact</Button>
          </Stack>
        </Box>
      </Dialog>

      <Dialog open={reminderOpen} onClose={() => setReminderOpen(false)}>
        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          if (selectedContact) {
            updateContactReminder(selectedContact.id, selectedContact.reminder);
            setReminderOpen(false);
          }
        }} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Update Contact Reminder</Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Frequency"
                type="number"
                value={selectedContact?.reminder?.frequency || 7}
                onChange={(e) => setSelectedContact({
                  ...selectedContact,
                  reminder: {
                    ...selectedContact.reminder,
                    frequency: parseInt(e.target.value)
                  }
                })}
                required
              />
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={selectedContact?.reminder?.unit || 'days'}
                  onChange={(e) => setSelectedContact({
                    ...selectedContact,
                    reminder: {
                      ...selectedContact.reminder,
                      unit: e.target.value
                    }
                  })}
                  label="Unit"
                >
                  <MenuItem value="days">Days</MenuItem>
                  <MenuItem value="weeks">Weeks</MenuItem>
                  <MenuItem value="months">Months</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Button type="submit" variant="contained">Update Reminder</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ContactsPage;
