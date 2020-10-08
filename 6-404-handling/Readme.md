A common use case for when you’re building a web app is to have a “catch all” route that will be rendered if none of your other routes match. A common example of this would be a 404 page.

To see how this works with React Router v4, let’s first render a navbar with the following paths - /, /will-match, /will-not-match, and /also/will/not/match.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/will-match">Will Match</Link></li>
            <li><Link to="/will-not-match">Will Not Match</Link></li>
            <li><Link to="/also/will/not/match">Also Will Not Match</Link></li>
          </ul>
        </div>
      </Router>
    )
  }
}

export default App
💻 Play with the code.

Now that we have the navbar set up, let’s create three different components to render - Home, which will match on /, WillMatch which will match on /will-match, and NoMatch, which will be the catch-all component which will render only if none of the other Route's match.

const Home = () => <h1>Home</h1>

const WillMatch = () => <h3>Matched!</h3>

const NoMatch = ({ location }) => (
  <h3>No match for <code>{location.pathname}</code></h3>
)
💻 Play with the code.

Now that we have the components which are going to be rendered, we need to actually render some Routes. Home and WillMatch are straight forward, you just render them as you normally would.

render() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/will-match">Will Match</Link></li>
          <li><Link to="/will-not-match">Will Not Match</Link></li>
          <li><Link to="/also/will/not/match">Also Will Not Match</Link></li>
        </ul>

        <Route path="/" exact component={Home}/>
        <Route path="/will-match" component={WillMatch}/>
      </div>
    </Router>
  )
}
💻 Play with the code.

Now the question becomes, how do we render NoMatch? Remember, we only want to render NoMatch if both the / and /will-match Routes don’t match. There are two parts to accomplishing this - the first is that if you render a Route but don’t specify a path prop, that route will always match and render the component. Let’s do that for our NoMatch component.

<Route path="/" exact component={Home}/>
<Route path="/will-match" component={WillMatch}/>
<Route component={NoMatch} />
💻 Play with the code.

That’s closer, but if you play around with the app, you know we’re not done yet. Now the app renders the Home and WillMatch components properly but it also always renders the NoMatch component no matter what path we’re on.

What we need is a way to tell React Router v4 that we only want to render the first Route that matches - even if there’s more than one match. By doing this, our NoMatch component will only get rendered if the two Routes above it, / and /will-match aren’t matched.

The good news is React Router v4 comes with a component that does exactly this and it’s called Switch. By wrapping your Routes inside of Switch, React Router will only render the first Route that matches.

render() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/will-match">Will Match</Link></li>
          <li><Link to="/will-not-match">Will Not Match</Link></li>
          <li><Link to="/also/will/not/match">Also Will Not Match</Link></li>
        </ul>

        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/will-match" component={WillMatch}/>
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  )
}
💻 Play with the code.

Now if the user isn’t at / or /will-match, the NoMatch component will be rendered.

You can utilize this same pattern to render a client-side 404 page if none of your other Routes match.

<Switch>
  <Route exact path="/" component={Home}/>
  <Route exact path="/profile" component={Profile}/>
  <Route component={FourZeroFour} />
</Switch>