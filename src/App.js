import React, { useState, useEffect } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");

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
    const input = {
      note
    };
    const { data } = await API.graphql(graphqlOperation(createNote, { input }));
    const newNote = data.createNote;
    console.log(data);
    setNotes([newNote, ...notes]);
    setNote("");
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
            <li className="list pa1 f3">{note.note}</li>
            <button className="bg-transparent bn f4">
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
