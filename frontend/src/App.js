import React from 'react';
import './index.scss'
import '@material-ui/core/styles';
import Logs from './containers/Logs';
import Logs2 from './containers/Logs2';
import {Switch, Route, Router} from 'react-router';
import store from './store';
import {Provider} from "react-redux";
import {Container} from "@material-ui/core";
import {ApolloClient} from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import {InMemoryCache} from "apollo-cache-inmemory";
import {HttpLink} from "apollo-link-http";
import {createBrowserHistory} from "history";

const client = new ApolloClient({
  link: new HttpLink({uri: '/graphql/'}),
  cache: new InMemoryCache(),
});

const history = createBrowserHistory();

function App() {
  return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Router history={history}>
            <main role="main">
              <Container maxWidth="lg">
                <Switch>
                  <Route exact path="/v/"><Logs2/></Route>
                  <Route path="/" component={Logs}/>
                </Switch>
              </Container>
            </main>
          </Router>
        </Provider>
      </ApolloProvider>
  )
}

export default App;