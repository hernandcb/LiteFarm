import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from '../../../history';
import { action } from '@storybook/addon-actions';
import state from './state';
import NavBar from '../../../containers/Navigation';
import { ThemeProvider } from 'react-bootstrap';
import theme from '../../../assets/theme';
import { useTranslation } from 'react-i18next';

const store = {
  getState: () => {
    return state;
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

const auth = (isAuthenticated = false) => ({
  logout: () => {},
  isAuthenticated: () => isAuthenticated,
});
export const useI18next = () => {
  const { t, ready } = useTranslation(
    [
      'translation',
      'crop',
      'common',
      'disease',
      'task',
      'expense',
      'fertilizer',
      'message',
      'gender',
      'role',
      'harvest_uses',
      'soil',
    ],
    { useSuspense: false },
  );
  return ready;
};

export default [
  (story) => {
    const ready = useI18next();
    return ready ? (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
              }}
            >
              <NavBar history={history} auth={auth()} />
              <div
                className="app"
                style={{
                  width: '100%',
                  maxWidth: '1024px',
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {story()}
              </div>
            </div>
          </Router>
        </ThemeProvider>
      </Provider>
    ) : (
      <div>loading</div>
    );
  },
];

export const authenticatedDecorators = [
  (story) => {
    const ready = useI18next();
    return ready ? (
      <Provider store={store}>
        <Router history={history}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            <NavBar history={history} auth={auth(true)} />
            <div
              className="app"
              style={{
                width: '100%',
                maxWidth: '1024px',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {story()}
            </div>
          </div>
        </Router>
      </Provider>
    ) : (
      <div>loading</div>
    );
  },
];

export const componentDecorators = [
  (story) => {
    const ready = useI18next();
    return ready ? <div style={{ padding: '3rem' }}>{story()}</div> : <div>loading</div>;
  },
];

export const componentDecoratorsGreyBackground = [
  (story) => {
    const ready = useI18next();
    return ready ? (
      <div style={{ padding: '3rem', backgroundColor: 'gray' }}>{story()}</div>
    ) : (
      <div>loading</div>
    );
  },
];

export const componentDecoratorsWithoutPadding = [
  (story) => {
    const ready = useI18next();
    return ready ? story() : <div>loading</div>;
  },
];
