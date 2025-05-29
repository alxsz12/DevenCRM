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
import { 
  Message as MessageIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useContacts } from '../context/ContactContext';
import { styled } from '@mui/material/styles';

const ContactPill = styled(Paper)(({ theme }) => ({  padding: theme.spacing(2),
  paddingRight: '90px',
  marginBottom: theme.spacing(2),
  borderRadius: '24px',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'visible',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3]
  }
}));

const StatusIndicator = styled('div')(({ color }) => ({
  width: '65px',
  height: 'calc(100% + 2px)',
  backgroundColor: color,
  position: 'absolute',
  right: '-1px',
  top: '-1px',
  bottom: '-1px',
  borderRadius: '24px',
  transition: 'background-color 0.3s'
}));

const getStatusColor = (daysSinceContact, reminderFrequency) => {
  const ratio = daysSinceContact / reminderFrequency;
  if (ratio <= 0.5) return '#4caf50'; // Green
  if (ratio <= 0.8) return '#ffeb3b'; // Yellow
  return '#f44336'; // Red
};

const ContactInfo = styled('div')({
  flex: 1,
  marginLeft: '16px',
  minWidth: 0,
});

const ContactsPage = () => {  
  const { contacts, addContact, updateContactReminder, updateLastContacted, getDaysSinceLastContact } = useContacts();
  const [open, setOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
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
          
          return (            <ContactPill 
              key={contact.id} 
              elevation={1} 
              expanded={expandedId === contact.id}
              onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
            >              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%',
                position: 'relative'
              }}>
                <ContactInfo>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <div>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>{contact.name}</Typography>
                      {!expandedId === contact.id && (
                        <Typography variant="body2" color="textSecondary">
                          Last contacted: {daysSince} days ago | 
                          Reminder: Every {contact.reminder.frequency} {contact.reminder.unit}
                        </Typography>
                      )}
                      {expandedId === contact.id && (
                        <>
                          <Typography color="textSecondary" sx={{ fontSize: '0.9rem' }}>{contact.phone}</Typography>
                          <Typography color="textSecondary" sx={{ fontSize: '0.9rem' }}>{contact.email}</Typography>
                        </>
                      )}
                    </div>
                  </Stack>
                </ContactInfo>
                <Stack direction="row" spacing={1} alignItems="center">
                  {expandedId === contact.id && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLastContacted(contact.id);
                      }}
                      color="primary"
                      size="small"
                      sx={{ 
                        zIndex: 1,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,1)'
                        }
                      }}
                    >
                      <MessageIcon />
                    </IconButton>
                  )}
                  {expandedId === contact.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Stack>
              </Box>              {expandedId === contact.id && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Stack spacing={2}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{ fontSize: '0.9rem' }}>
                          <strong>Phone:</strong> {contact.phone}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem' }}>
                          <strong>Email:</strong> {contact.email}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">
                          Last contacted: {daysSince} days ago
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                          Reminder: Every {contact.reminder.frequency} {contact.reminder.unit}
                          <Button 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
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

                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<PhoneIcon />}
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${contact.phone}`;
                        }}
                      >
                        Call
                      </Button>
                      <Button
                        startIcon={<MessageIcon />}
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `sms:${contact.phone}`;
                        }}
                      >
                        Text
                      </Button>
                      <Button
                        startIcon={<EmailIcon />}
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${contact.email}`;
                        }}
                      >
                        Email
                      </Button>
                    </Stack>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>Recent Notes</Typography>
                      {contact.notes && contact.notes.length > 0 ? (
                        contact.notes.map((note) => (
                          <Paper 
                            key={note.id} 
                            variant="outlined" 
                            sx={{ p: 1.5, backgroundColor: '#f5f5f5', mb: 1 }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              {new Date(note.date).toLocaleDateString()}
                            </Typography>
                            <Typography>{note.content}</Typography>
                          </Paper>
                        ))
                      ) : (
                        <Typography color="textSecondary">No notes yet</Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              )}
              
              {expandedId !== contact.id && (
                <StatusIndicator color={getStatusColor(daysSince, reminderDays)} />
              )}
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
