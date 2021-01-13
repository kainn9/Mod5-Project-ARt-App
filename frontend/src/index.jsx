
import './index.css';
import 'semantic-ui-css/semantic.min.css'

import React from 'react';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';


import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducer';
import App from './App';

import * as serviceWorker from './serviceWorker';

let store = createStore(rootReducer, applyMiddleware(thunk));


  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );

serviceWorker.unregister();
