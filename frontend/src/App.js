import React from 'react';
import './index.scss'
import '@material-ui/core/styles';
import Logs from './containers/Logs';
import store from './store';
import {Provider} from "react-redux";
import { Container } from "@material-ui/core";

function App() {
  return (
    <Provider store={store}>
      <main role="main">
        <Container maxWidth="lg">
          <Logs/>
        </Container>
      </main>
    </Provider>
  )
}

export default App;