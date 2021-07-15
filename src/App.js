import DNavBar from './components/DNavBarX';
import './App.css';
import IBoard from "./pages/IBoard";
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

function App() {
  useEffect(() => {
    document.title = "iBoard";
  })
  document.title = "iBoard";
  return (
    < Router >
      <div className="App" >
        <DNavBar page="dgIn" />
        <Route exact path="/" >
          <IBoard />
        </Route>
      </div>
    </Router>
  );
}

export default App;
