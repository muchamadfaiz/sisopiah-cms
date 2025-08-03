import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import Views from './views';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet'

const SITE_TITLE = process.env.REACT_APP_SITE_TITLE || "Portal Data | SiSopiah"
const DESCRIPTION = process.env.DESCRIPTION || "Portal Data | SiSopiah"
const FAVICON = "./favicon.png"

function App() {
  return (
    <div className="App">
      <Helmet>
        {SITE_TITLE && <title>{SITE_TITLE}</title>}
        {FAVICON && <link rel="icon" href={FAVICON} />}
        {FAVICON && <meta property="og:image" content={FAVICON} />}
        {FAVICON && <link rel="apple-touch-icon" href={FAVICON} />}
        {DESCRIPTION && <meta name="description" content={DESCRIPTION} />}
      </Helmet>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" component={Views}/>
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
