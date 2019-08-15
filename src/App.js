import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './views/home';
import Characters from './views/characters';
import './index.css';
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={ Home } />
          <Route exact path="/characters/:id" component={ Characters } />
        </div>
      </Router>
    );
  }
}

export default App;
