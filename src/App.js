import './App.css';
import IBoard from "./pages/IBoard";
import IdSetter from './pages/IdSetter';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import About from './pages/About';

function App() {
  useEffect(() => {
    document.title = "iBoard";
  })
  document.title = "iBoard";
  return (
    < Router >
      <div className="App" >        
        <Route exact path="/" >
          <IBoard />
        </Route>
        <Route exact path="/byId/:uid" >
          <IdSetter />
        </Route>
        <Route path="/about" >
          <About />
        </Route>
      </div>
    </Router>
  );
}

export default App;
