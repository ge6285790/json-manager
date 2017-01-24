import { createStore, compose } from 'redux';
import reducers from '../reducers';

// const store = createStore(reducers);

function getStore() {
  const store = createStore(reducers, compose(
    // applyMiddleware(promiseMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  // module 是 webpack 包過一層時提供的，signature 如下：
  // function(module, exports, __webpack_require__) {
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}

export default getStore();
