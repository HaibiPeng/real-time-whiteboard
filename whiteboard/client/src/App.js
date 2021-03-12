import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Join from './components/Join/Join';
import Whiteboard from './components/whiteboard/Whiteboard';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/whiteboard" component={Whiteboard} />
    </Router>
  );
}

export default App;