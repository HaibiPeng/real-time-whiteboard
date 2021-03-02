import React from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Join from './components/Join/Join';
import Whiteboard from './components/whiteboard/Whiteboard';
import getUserid from '../protocol/layer2/stateManageLayer';

const App = () => {
  const userid = getUserid();
  
  return (
    <div>
    {
      userid === null ?
        <Join /> :
        <Whiteboard />
    }
    </div>
  );
}

export default App;