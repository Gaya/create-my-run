import React, { useEffect } from 'react';
import './App.css';
import { RoutesResponse } from '../server/types';

function App() {
  useEffect(() => {
    // const url = 'http://localhost:4000';
    //
    // fetch(`${url}/route`)
    //   .then((res) => res.json() as Promise<RoutesResponse>)
    //   .then(console.log)
    //   .catch(console.error);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Generate a Run Route
      </header>
      <div>
        Hallo
      </div>
    </div>
  );
}

export default App;
