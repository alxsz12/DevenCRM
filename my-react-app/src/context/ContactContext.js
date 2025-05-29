import React, { createContext, useState, useContext, useEffect } from 'react';

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem('contacts');
    return savedContacts ? JSON.parse(savedContacts) : [];
  });
  
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem('groups');
    return savedGroups ? JSON.parse(savedGroups) : [];
  });

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const addContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
      lastContacted: new Date().toISOString(),
      reminder: {
        frequency: contact.reminder?.frequency || 7,
        unit: contact.reminder?.unit || 'days'
      },
      notes: []
    };
    setContacts([...contacts, newContact]);
  };

  const updateContactReminder = (contactId, reminder) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, reminder }
        : contact
    ));
  };

  const updateLastContacted = (contactId) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, lastContacted: new Date().toISOString() }
        : contact
    ));
  };

  const addNote = (contactId, note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { 
            ...contact, 
            notes: [...(contact.notes || []), newNote],
            lastContacted: new Date().toISOString()
          }
        : contact
    ));
  };

  const addGroup = (group) => {
    const newGroup = {
      ...group,
      id: Date.now().toString(),
      contacts: []
    };
    setGroups([...groups, newGroup]);
  };

  const addContactToGroup = (contactId, groupId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, contacts: [...(group.contacts || []), contactId] }
        : group
    ));
  };

  const getDaysSinceLastContact = (lastContacted) => {
    if (!lastContacted) return 0;
    const lastDate = new Date(lastContacted);
    const now = new Date();
    const diffTime = Math.abs(now - lastDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <ContactContext.Provider value={{
      contacts,
      groups,
      addContact,
      addNote,
      addGroup,
      addContactToGroup,
      updateContactReminder,
      updateLastContacted,
      getDaysSinceLastContact
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => useContext(ContactContext);
