import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  TextField, 
  Stack, 
  Card, 
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useContacts } from '../context/ContactContext';

const GroupsPage = () => {
  const { groups, contacts, addGroup, addContactToGroup } = useContacts();
  const [open, setOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', contacts: [] });
  const [selectedContact, setSelectedContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addGroup(newGroup);
    setNewGroup({ name: '', contacts: [] });
    setOpen(false);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (selectedGroup && selectedContact) {
      addContactToGroup(selectedContact, selectedGroup.id);
      setSelectedContact('');
      setAddContactOpen(false);
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Groups</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Create New Group</Button>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {groups.map((group) => (
          <Card key={group.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6">{group.name}</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setSelectedGroup(group);
                    setAddContactOpen(true);
                  }}
                >
                  Add Contact
                </Button>
              </Stack>
              
              {group.contacts?.map((contactId) => (
                <Typography key={contactId}>
                  {contacts.find(c => c.id === contactId)?.name}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Create New Group</Typography>
          <Stack spacing={2}>
            <TextField
              label="Group Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              required
            />
            <Button type="submit" variant="contained">Create Group</Button>
          </Stack>
        </Box>
      </Dialog>

      <Dialog open={addContactOpen} onClose={() => setAddContactOpen(false)}>
        <Box component="form" onSubmit={handleAddContact} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>Add Contact to {selectedGroup?.name}</Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Contact</InputLabel>
              <Select
                value={selectedContact}
                onChange={(e) => setSelectedContact(e.target.value)}
                required
              >
                {contacts.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    {contact.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">Add to Group</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default GroupsPage;
