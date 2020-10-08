A common UI pattern is to have a sidebar or breadcrumb navbar in your app. Because React Router v4 allows you to render and match more than one Route per page, implementing this pattern is pretty straight forward. The goal of this post is to show how you can, by rendering multiple Routes, render separate components at separate parts of your page (like a sidebar).

The first thing we’ll do, and really the secret implementing a sidebar or breadcrumbs, is to create a routes array. Each item in the array is going to contain all the information about the specific route, including which component should be rendered.

const routes = [
  {
    path: '/',
    exact: true,
    sidebar: () => <div>home!</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: '/bubblegum',
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: '/shoelaces',
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
]
Now, because we’ve abstracted our routes to this array, whenever we want to render any Routes, we can map over it and specify which component should be rendered (main or sidebar).

To show how this is done, let’s first build out the basic skeleton for our app.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const routes = [
  {
    path: '/',
    exact: true,
    sidebar: () => <div>home!</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: '/bubblegum',
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: '/shoelaces',
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
]

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ display: 'flex' }}>
          <div style={{
            padding: '10px',
            width: '40%',
          }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/bubblegum">Bubblegum</Link></li>
              <li><Link to="/shoelaces">Shoelaces</Link></li>
            </ul>

          </div>
        </div>
      </Router>
    )
  }
}

export default App
💻 Play with the code.

Remember, the goal here is to render multiple components in different places of the app, based on the app’s path. We already have our routes array, so wherever we want to render some Routes we can map over it. First, let’s add some Routes to the sidebar (inside of our nav).

render() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div style={{
          padding: '10px',
          width: '40%',
        }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/bubblegum">Bubblegum</Link></li>
            <li><Link to="/shoelaces">Shoelaces</Link></li>
          </ul>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.sidebar}
            />
          ))}
        </div>
      </div>
    </Router>
  )
}
💻 Play with the code.

The biggest thing to notice is that we’ve passed route.sidebar to Routes component prop. This is the crux of the example and shows the importance of the routes array we created earlier. Now whenever the app’s location matches the path, the sidebar component will be rendered. However, we don’t just want to stop there. We also want to render a component in the main body of our app as well. To do that, we’ll map over routes again but instead of component being route.sidebar, we’ll pass it route.main.

render() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <div style={{
          padding: '10px',
          width: '40%',
        }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/bubblegum">Bubblegum</Link></li>
            <li><Link to="/shoelaces">Shoelaces</Link></li>
          </ul>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.sidebar}
            />
          ))}
        </div>

        <div style={{ flex: 1, padding: '10px' }}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
      </div>
    </Router>
  )
}
💻 Play with the code.

Because React Router v4 allows us to render and match more than one Route on a page, and because we abstracted our routes to their own array, we can render different components at different sections of our page whenever the app’s location matches the Routes path.