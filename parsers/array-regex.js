let routes = [];

const getRoute = path => {
  let foundIndex = 0;
  const route = routes.find((r, i) => {
    if (r instanceof RegExp) {
      foundIndex = i;
      return r.test(path);
    }
    return false;
  });

  if (route) {
    const matches = route.exec(path);

    return {
      params: matches,
      fn: routes[foundIndex + 1],
    };
  }

  return undefined;
};

export default function arrayRegex(_routes) {
  routes = _routes;
  return function(path) {
    const route = getRoute(path.substr(1));
    if (route) {
      route.fn(route.params);
    } else {
      console.error(`router: no match for ${path}`);
    }
  };
}
