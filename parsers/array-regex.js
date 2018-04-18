let routes = [];

// Remove leading / and query string
function formatPath(path) {
  return path.substr(1).split('?')[0];
}

export function match(re, path) {
  return re.test(formatPath(path));
}

const getRoute = path => {
  let foundIndex = 0;
  const route = routes.find((r, i) => {
    if (r instanceof RegExp) {
      foundIndex = i;
      return match(r, path);
    }
    return false;
  });

  if (route) {
    const matches = route.exec(formatPath(path));

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
    const route = getRoute(path);
    if (route) {
      route.fn(route.params);
    } else {
      console.error(`router: no match for ${path}`);
    }
  };
}
