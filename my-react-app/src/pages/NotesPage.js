import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, TextField, Stack, Card, CardContent } from '@mui/material';
import { useContacts } from '../context/ContactContext';
import { format } from 'date-fns';

const NotesPage = () => {
  const { contacts, addNote } = useContacts();
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newNote, setNewNote] = useState({
    content: '',
    date: new Date().toISOString()
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedContact) {
      addNote(selectedContact.id, newNote);
      setNewNote({
        content: '',
        date: new Date().toISOString()
      });
      setOpen(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Notes</Typography>
      
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {contacts.map((contact) => (
          <Card key={contact.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6">{contact.name}</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setSelectedContact(contact);
                    setOpen(true);
                  }}
                >
                  Add Note
                </Button>
              </Stack>
              
              {contact.notes?.map((note) => (
                <Card key={note.id} variant="outlined" sx={{ mb: 1, bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {format(new Date(note.date), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography>{note.content}</Typography>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Add Note for {selectedContact?.name}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Note"
              multiline
              rows={4}
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              required
            />
            <Button type="submit" variant="contained">Add Note</Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default NotesPage;
