React Router v4 introduced a declarative, component-based approach to routing - moving away from a static route config. Though there are many benefits to this approach, there are still some benefits to having a central route config. Because React Router v4 is “just components” and therefore “just javascript”, having a central route config with React Router v4 is still very much possible. The key? Having your routes represented as an array.

const routes = [
  {
    path: '/sandwiches',
    component: Sandwiches
  },
  {
    path: '/tacos',
    component: Tacos,
  }
]
Now that your routes are centralized to an array, in order to render your Routes, you map over the array.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const Sandwiches = () => <h2>Sandwiches</h2>
const Tacos = () => <h2>Tacos</h2>

const routes = [
  {
    path: '/sandwiches',
    component: Sandwiches
  },
  {
    path: '/tacos',
    component: Tacos,
  }
]

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/tacos">Tacos</Link></li>
            <li><Link to="/sandwiches">Sandwiches</Link></li>
          </ul>

          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              component={route.component}
            />
          ))}
        </div>
      </Router>
    )
  }
}
💻 Play with the code.

Wow, look at that 🧐. We’ve used the power of JavaScript to create a central route config.

Now, what if we wanted to have some nested routes? The first thing we would need to do is add some nested routes to our route config array.

For our example, let’s say the /tacos route is going to render some child routes - /tacos/bus and /tacos/cart.

const Bus = () => <h3>Bus</h3>
const Cart = () => <h3>Cart</h3>

const routes = [
  {
    path: '/sandwiches',
    component: Sandwiches
  },
  {
    path: '/tacos',
    component: Tacos,
    routes: [
      {
        path: '/tacos/bus',
        component: Bus
      },
      {
        path: '/tacos/cart',
        component: Cart
      }
    ]
  }
]
💻 Play with the code.

Now that we’ve added some nested routes to our route config, we need to modify the way we’re mapping over them to support the nested routes. The idea here is that when we map over our routes array, for each item we’re going to render a Route component as we did before, but now, instead of just rendering the component, we’re going to pass any child routes to that component so that it can also render the child routes.

That was a little wordy so let’s take a look at some code. Because we’ve added a little complexity to how we’re rendering the Route components, let’s abstract that to a new component called RouteWithSubRoutes.

const RouteWithSubRoutes = (route) => (
  <Route path={Route.path} />
)

...

render() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/tacos">Tacos</Link></li>
          <li><Link to="/sandwiches">Sandwiches</Link></li>
        </ul>

        {routes.map((route) => (
          <RouteWithSubRoutes key={route.path} {...route} />
        ))}
      </div>
    </Router>
  )
}
💻 Play with the code.

Now, as mentioned earlier, we need to pass the component that’s being rendered any child routes so that it can also render those. Because we need to pass the component being rendered a prop, we’ll use React Router’s render prop.

const RouteWithSubRoutes = (route) => (
  <Route path={route.path} render={(props) => (
    <route.component {...props} routes={route.routes}/>
  )}/>
)
💻 Play with the code.

Solid. Now, any time a Route renders a component, that component will be passed any child routes that may or may not exist as a routes prop.

Now, the only thing left to do is modify our Tacos component to receive those child routes and, for each item in routes, render a RouteWithSubRoutes component.

const Tacos = ({ routes }) => (
  <div>
    <h2>Tacos</h2>
    <ul>
      <li><Link to="/tacos/bus">Bus</Link></li>
      <li><Link to="/tacos/cart">Cart</Link></li>
    </ul>

    {routes.map((route) => (
      <RouteWithSubRoutes key={route.path} {...route} />
    ))}
  </div>
)
💻 Play with the code.

To recap, by representing our routes as an array, we were able to create a central route config for our app. Also, when we created the RouteWithSubRoutes component, that component would pass any child routes down to the component that’s being rendered so that the rendered component could also render the child routes (as seen in Tacos.)