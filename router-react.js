import React, { Component } from 'react';
import PropTypes from 'prop-types';
import router, { history, subscribe, getRouteParams, setRouteParams } from './';

function handleLink(href) {
  return function(event) {
    if (
      !event.button === 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }
    event.preventDefault();
    history.push(href);
  };
}

export function Link({ href, children, as, ...props }) {
  return React.createElement(
    as || 'a',
    {
      ...props,
      ...(as ? {} : { href }),
      onClick: handleLink(href),
    },
    children,
  );
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  as: PropTypes.func,
};

export class Redirect extends Component {
  componentWillMount() {
    history.push(this.props.to);
  }

  render() {
    return null;
  }
}

Redirect.propTypes = {
  to: PropTypes.string.isRequired,
};

export function withRouter(WrappedComponent) {
  return class extends Component {
    constructor() {
      super();
      this.subscription = subscribe(() => this.setState({}));
    }

    componentWillUnmount() {
      this.subscription();
    }

    render() {
      return React.createElement(WrappedComponent, {
        ...this.props,
        router: {
          Link,
          location: window.location,
          params: getRouteParams(),
        },
      });
    }
  };
}

let update = () => {};
let component = null;

export function render(C, params = {}) {
  component = C;
  setRouteParams(params);
  update();
}

export default class Router extends Component {
  constructor(props) {
    super();
    router(props.parser(props.routes));
    update = () => this.setState({});
  }

  render() {
    return React.createElement(component);
  }
}

Router.propTypes = {
  routes: PropTypes.array.isRequired,
  parser: PropTypes.func.isRequired,
};
