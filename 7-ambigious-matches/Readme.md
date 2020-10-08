Place your dynamic Route at the end of all of your Routes and place all of your Routes inside of a Switch component. That way, only the first Route that matches will be rendered.

Here’s the scenario. It’s February 2020. There’s an excess of venture capital and you’ve managed to snag some by pitching your “Twitter for minimalists” app. You’re a long time contributor to Hacker News so you’re confident you can knock it out in a weekend.

The app is simple with only three routes - /, /notifications, and /:handle.

You’re a few hours in and you hit a snag. You run rm -rf node_modules && npm install, no luck. You check Twitter. You come back to your app. It’s still broken.

You take a look at your Routes.

<Route exact path='/' component={Home} />
<Route path='/notifications' component={Notifications} />
<Route path='/:handle' component={Profile} />
The issue you’re running into is that every time you navigate to /notifications, not only does the Notifications component render, but so does the Profile component since /:handle is also matching. What you need is a way to tell React Router to not match on /:handle if /notifications already matched. You decide to google “ambiguous matches” and you find this post, meta.

First, let’s create our navbar to navigate between our three routes. We’ll use /tylermcginnis and /dan-abramov to represent our dynamic user links.

import React from 'react'
import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
            <li><Link to="/tylermcginnis">Tyler (dynamic)</Link></li>
            <li><Link to="/dan_abramov">Dan (dynamic)</Link></li>
          </ul>
        </div>
      </Router>
    )
  }
}
💻 Play with the code.

Now that we have our navbar setup, let’s create our components that we’ll be rendering. We’ll have Home, Notifications, and Profile.

const Home = () => <h2>Home</h2>
const Notifications = () => <h2>Notifications</h2>
const Profile = ({ match }) => (
  <div>
    <h2>Profile: {match.params.handle}</h2>
  </div>
)
Now comes the point of this post. Earlier we mentioned that our Routes looked like this -

<Route exact path='/' component={Home} />
<Route path='/notifications' component={Notifications} />
<Route path='/:handle' component={Profile} />
The problem, as mentioned earlier, is every time you navigate to /notifications, not only does the Notifications component render, but so does the Profile component since /:handle is also matching. What we need is a way to tell React Router v4 to not match on /:handle if /notifications already matched. Another way to put that is we only want to render the first Route that matches, not every Route that matches which is the default behavior.

To do this, you can wrap your Routes inside of the Switch component that comes with React Router v4.

<Switch>
  <Route exact path='/' component={Home} />
  <Route path='/notifications' component={Notifications} />
  <Route path='/:handle' component={Profile} />
</Switch>