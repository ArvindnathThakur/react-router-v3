## URL Parameters with React Router v4

URL parameters are parameters whose values are set dynamically in a page’s URL. This allows a route to render the same component (UI) while passing that component the dynamic portion of the URL so it can change based off of it.

Take Twitter for example. Regardless of which profile you go to, Twitter is going to show you the same UI just with different data. They do this by utilizing URL Parameters. If rendered by React Router v4, the Route for the profile pages may look like this.

<Route path='/:handle' component={Profile} />
Notice that the path has a : in front of it. That’s because it’s dynamic. Instead of matching literally, it’s matching for a specific pattern. With this app, anytime someone visits a route that matches that pattern (/tylermcginnis, /dan_abramov, /anything), the Profile component is going to be rendered.

Now the question becomes, how do we access the dynamic portion of the URL (in this case, handle) from the component that’s rendered? Whenever React Router v4 renders a component, it’ll pass to that component three props, match, location, and history. For our use case, we can grab the URL parameter (handle) as a property on match.params.
```Javascript
class Profile extends React.Component {
  state = {
    user: null
  }
  componentDidMount () {
    const { handle } = this.props.match.params

    fetch(`https://api.twitter.com/user/${handle}`)
      .then((user) => {
        this.setState(() => ({ user }))
      })
  }
  render() {
    ...
  }
}
```
Now let’s look at the example from the React Router v4 docs. It’s a simple app that allows us to navigate between 4 different “accounts” - netflix, zillow-group, yahoo, and module-create. Each account will have its own page, similar to Twitter we saw earlier.

First, let’s import the components we’ll need and create our navbar for linking between the different accounts.
```Javascript
import React from 'react'
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <h2>Accounts</h2>
          <ul>
            <li><Link to="/netflix">Netflix</Link></li>
            <li><Link to="/zillow-group">Zillow Group</Link></li>
            <li><Link to="/yahoo">Yahoo</Link></li>
            <li><Link to="/modus-create">Modus Create</Link></li>
          </ul>
        </React.Fragment>
      </Router>
    )
  }
}

export default App
```
Now that we can navigate between our different accounts, we need to actually render some UI for each account page. To keep things simple, we’ll create a component that just renders the name of the account, i.e. the URL Parameter.
```Javascript
const Account = ({ match }) => (
  <div>
    <h3>ID: {match.params.account}</h3>
  </div>
)
```
Now that we have our links and the component to render, let’s create our Route with a URL Parameter. Like we saw earlier with Twitter, the pattern we want to use is /:account.

```Javascript
render() {
  return (
    <Router>
      <React.Fragment>
        <h2>Accounts</h2>
        <ul>
          <li><Link to="/netflix">Netflix</Link></li>
          <li><Link to="/zillow-group">Zillow Group</Link></li>
          <li><Link to="/yahoo">Yahoo</Link></li>
          <li><Link to="/modus-create">Modus Create</Link></li>
        </ul>

        <Route path='/:account' component={Account} />
      </React.Fragment>
    </Router>
  )
}
```

And that’s it. Because we’re using a URL parameter, we can have four different paths render the same component and that component will be passed the URL parameter (in this case account) as a prop under `match.params`.