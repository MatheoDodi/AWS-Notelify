import React, { useState } from "react";
import { withAuthenticator } from "aws-amplify-react";

function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      note: "Hello World"
    }
  ]);

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">AWS Notelify</h1>
      <form className="mb3">
        <input type="text" className="pa2 f4" placeholder="Write your note" />
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
