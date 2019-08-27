import React, { useState, useEffect } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote, deleteNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const getNotes = async () => {
      const { data } = await API.graphql(graphqlOperation(listNotes));
      setNotes(data.listNotes.items);
    };

    getNotes();
  }, []);

  const handleChangeNote = e => setNote(e.target.value);

  const handleAddNote = async e => {
    e.preventDefault();
    if (!updating) {
      const input = {
        note
      };
      const { data } = await API.graphql(
        graphqlOperation(createNote, { input })
      );
      const newNote = data.createNote;
      console.log(data);
      setNotes([newNote, ...notes]);
      setNote("");
    } else {
      // todo: add logic for updating note
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

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">AWS Notelify</h1>
      <form className="mb3" onSubmit={handleAddNote}>
        <input
          type="text"
          className="pa2 f4"
          placeholder="Write your note"
          onChange={handleChangeNote}
          value={note}
        />
        <button className="pa2 f4" type="submit">
          Add Note
        </button>
      </form>
      <div>
        {notes.map(note => (
          <div key={note.id} className="flex items-center">
            <li
              className="list pa1 f3"
              onClick={() => handleUpdateNote(note.id)}
            >
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
