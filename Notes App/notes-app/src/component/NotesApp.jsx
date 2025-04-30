import { useEffect, useState } from 'react';

const NotesApp = () => {
  const [userInput, getUserInput] = useState(''); // get user input from search box
  const [notes, setNote] = useState(() => {
    try {
      const item = localStorage.getItem('notes');
      console.log('Loaded notes:', item); // Log for debugging
      if (!item) return [];
      const parsedItem = JSON.parse(item);
      return Array.isArray(parsedItem)
        ? parsedItem.map((note) => ({
            ...note,
            isStriked: note.isStriked || false,
          }))
        : [];
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error);
      return [];
    }
  });
  const [editIndex, setEditIndex] = useState(null);
  const [updatedUserInput, getUpdatedUserInput] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleChange = (event) => {
    getUserInput(event.target.value);
  };

  const handleClick = () => {
    if (userInput.trim()) {
      setNote((prevNote) => [
        ...prevNote,
        { text: userInput, isStriked: false },
      ]);
      getUserInput('');
    }
  };

  const removeNote = (indexToRemove) => {
    const newNotes = notes.filter((_, index) => index !== indexToRemove);
    setNote(newNotes);
  };

  const toggleStrike = (index) => {
    setNote((prevNote) => {
      if (!prevNote) return [];
      return prevNote.map((note, idx) =>
        idx === index ? { ...note, isStriked: !note.isStriked } : note
      );
    });
  };

  const handleEditChange = (event) => {
    getUpdatedUserInput(event.target.value);
  };

  const editNote = (indexToUpdate) => {
    setEditIndex(indexToUpdate);
    getUpdatedUserInput(notes[indexToUpdate].text);
  };

  const updateNote = () => {
    if (updatedUserInput.trim()) {
      const newNotes = [...notes];
      newNotes[editIndex] = { ...newNotes[editIndex], text: updatedUserInput };
      setNote(newNotes);
      setEditIndex(null);
      getUpdatedUserInput('');
    }
  };

  const cancelEditing = () => {
    setEditIndex(null);
    getUpdatedUserInput('');
  };

  return (
    <div className='section'>
      <h1>KEEP</h1>
      <div className='input-container'>
        <input
          type='text'
          placeholder='Enter your note here...'
          className='username'
          value={userInput}
          onChange={handleChange}
        />
        <button className='search-button' onClick={handleClick}>
          Add Note
        </button>
      </div>

      <div className='note-container'>
        {notes.map((note, id) => {
          return (
            <div key={id}>
              {editIndex === id ? (
                <div className='edit-card'>
                  <input
                    type='text'
                    className='edit-input'
                    value={updatedUserInput}
                    onChange={handleEditChange}
                    placeholder='Edit your note...'
                  />
                  <div className='button-container'>
                    <button className='button' onClick={updateNote}>
                      <i className='fas fa-check-circle'></i>
                    </button>
                    <button className='cancel' onClick={cancelEditing}>
                      <i className='fas fa-times-circle'></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className='note-card'>
                  <li
                    style={{
                      textDecoration: note.isStriked ? 'line-through' : 'none',
                    }}
                  >
                    {note.text}
                  </li>
                  <div className='button-container'>
                    <button className='button' onClick={() => toggleStrike(id)}>
                      <i className='fa-solid fa-strikethrough'></i>
                    </button>
                    <button className='button' onClick={() => removeNote(id)}>
                      <i className='fas fa-trash-alt'></i>
                    </button>
                    <button className='button' onClick={() => editNote(id)}>
                      <i className='fas fa-edit'></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotesApp;
