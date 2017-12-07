const subscriptions = [];
let resolve = () => {};
let params;

export function getRouteParams() {
  return params;
}

export function setRouteParams(_params) {
  params = _params;
}

export function subscribe(fn) {
  subscriptions.push(fn);
  return function() {
    subscriptions.splice(subscriptions.indexOf(fn), 1);
  };
}

function notify(path) {
  resolve(path);
  subscriptions.forEach(fn => fn({ path, params }));
}

window.onpopstate = () => notify(window.location.pathname);

export const history = {
  push(path) {
    window.history.pushState({}, null, path);
    notify(path);
  },
  replace(path) {
    window.history.replaceState({}, null, path);
    notify(path);
  },
};

export default function router(fn) {
  resolve = fn;
  notify(window.location.pathname);
}
