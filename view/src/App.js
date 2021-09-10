import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import login from './pages/login';

import React from 'react';
function App() {
  return (
    <Router>
        <div>
          <Switch>
              <Route exact path="/login" component={login}/>
          </Switch>
        </div>
    </Router>
  );
}
export default App;