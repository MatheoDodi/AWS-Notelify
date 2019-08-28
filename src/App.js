import React, { useState, useEffect } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote, deleteNote, updateNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [updatedNoteId, setUpdatedNoteId] = useState(null);

  const getNotes = async () => {
    const { data } = await API.graphql(graphqlOperation(listNotes));
    setNotes(data.listNotes.items);
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleChangeNote = e => setNote(e.target.value);

  const handleAddOrUpdateNote = async e => {
    e.preventDefault();
    if (!updatedNoteId) {
      const input = {
        note
      };
      const { data } = await API.graphql(
        graphqlOperation(createNote, { input })
      );
      const newNote = data.createNote;
      setNotes([newNote, ...notes]);
      setNote("");
    } else {
      const input = {
        note: note,
        id: updatedNoteId
      };
      const res = await API.graphql(graphqlOperation(updateNote, { input }));
      const updatedNote = res.data.updateNote;

      const updatedNotes = notes.map(item => {
        if (item.id === updatedNote.id) {
          return updatedNote;
        }
        return item;
      });
      setNotes(updatedNotes);
      setNote("");
    }
  };

  const handleDeleteNote = async (e, noteId) => {
    const input = {
      id: noteId
    };
    const res = await API.graphql(graphqlOperation(deleteNote, { input }));
    const deletedNoteId = res.data.deleteNote.id;

    const filteredNotes = notes.filter(note => note.id !== deletedNoteId);
    setNotes(filteredNotes);
  };

  const handleUpdateNote = note => {
    setUpdatedNoteId(note.id);
    setNote(note.note);
  };

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">AWS Notelify</h1>
      <form className="mb3" onSubmit={handleAddOrUpdateNote}>
        <input
          type="text"
          className="pa2 f4"
          placeholder="Write your note"
          onChange={handleChangeNote}
          value={note}
        />
        <button className="pa2 f4" type="submit">
          {updatedNoteId ? "Update Note" : "Add Note"}
        </button>
      </form>
      <div>
        {notes.map(note => (
          <div key={note.id} className="flex items-center">
            <li className="list pa1 f3" onClick={() => handleUpdateNote(note)}>
              {note.note}
            </li>
            <button
              onClick={e => handleDeleteNote(e, note.id)}
              className="bg-transparent bn f4"
            >
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
