import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, CssBaseline, Box } from '@mui/material';
import { ContactProvider } from './context/ContactContext';
import ContactsPage from './pages/ContactsPage';
import NotesPage from './pages/NotesPage';
import GroupsPage from './pages/GroupsPage';
import './App.css';

function App() {
  return (
    <ContactProvider>
      <Router>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" component={Link} to="/">Contacts</Button>
              <Button color="inherit" component={Link} to="/notes">Notes</Button>
              <Button color="inherit" component={Link} to="/groups">Groups</Button>
            </Toolbar>
          </AppBar>
          <Container>
            <Routes>
              <Route path="/" element={<ContactsPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/groups" element={<GroupsPage />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ContactProvider>
  );
}

export default App;
