The most important thing to understand about React Router v4 is how composable it is. React Router doesn’t give you a house - it gives you some nails, screws, plywood, and a hammer while trusting that you can do the rest. A more technical way to say that is React Router v4 gives you the routing primitives upon which you can build your app. This concept really shines in the example we’re going to build.

What we want to do is create our own “old school” navbar. Basically what that means is we’ll add a “>” to the front of whatever Link is active. If our two routes were / and /about, the two states of our navbar would look like this

> Home
About
Home
> About
First, the easy part. Let’s build the skeleton of the app by building out our Routes and the components we’ll be rendering, Home and About.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          {/* Links */}

          <hr/>

          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
        </div>
      </Router>
    )
  }
}

export default App
💻 Play with the code.

Beautiful. Now we need to implement our custom Link component - we’ll call it OldSchoolMenuLink. The goal is to make the code below work properly. Notice it’s the OldSchoolMenuLink that will be in charge of adding and removing the > but its API is the same as Link.

render() {
  return (
    <Router>
      <div>
        <OldSchoolMenuLink exact={true} to="/">
          Home
        </OldSchoolMenuLink>
        <OldSchoolMenuLink to="/about">
          About
        </OldSchoolMenuLink>

        <hr/>

        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </div>
    </Router>
  )
}
First, let’s do the easy part. We know what props OldSchoolMenuLink is going to be taking in, so we can build out the skeleton of the component.

const OldSchoolMenuLink = ({ children, to, exact }) => (

)
Now the main question is, what is it going to render? Remember, the whole point of this component is to make this navbar UI work (based on the active route)

> Home
About
Home
> About
With that said, we know we’re going to render a Link and if the app’s current location matches the Links path, we’ll pre-pend it with a >.

Now the next question naturally becomes, how do we find out if the “app’s current location matches the Link's path”? Here’s one approach. We know the Links path because we’re passing it in as the to prop. We also know the app’s location because we can use window.location.pathname. With that said, we might implement OldSchoolMenuLink like this.

const OldSchoolMenuLink = ({ children, to, exact }) => {
  const match = window.location.pathname === to

  return (
    <div className={match ? 'active' : ''}>
      {match ? '> ' : ''}
      <Link to={to}>
        {children}
      </Link>
    </div>
  )
}
Well, this seems to work. The problem is it’s not really the React or React Router way of doing things. It also feels weird to reach out to the window object to get the app’s location. There’s a better way and it involves a tool that we already have at our disposal, React Router’s Route component.

Built into it, Route has a location checker - we should utilize it. Just as we did above, if there’s a match between the app’s location and the Links path, we want to pre-pend >. If you’re already familiar with React Router v4, your first instinct might be to use Routes render prop. The problem with this is, by design, a Route using render will only match if the path matches. That means we’d only ever get a Link if the Routes path prop matched the app’s current location. We’re building a navbar. We need to always get a Link and then only get a > if the path matches. The good news is the React Router team predicted this shortcoming and Route has another (rarely used) prop that is exactly what we need - children. children will “render whether the path matches the location or not … It works exactly like render except that it gets called whether there is a match or not.” That’s exactly what we need. Even better, “The children render prop receives all the same route props as the component and render methods, except when a route fails to match the URL, then match is null”. What that means is that we can use match to see if we should render a > or not.

const OldSchoolMenuLink = ({ children, to, exact }) => (
  <Route path={to} exact={exact} children={({ match }) => (
    <div className={match ? 'active' : ''}>
      {match ? '> ' : ''}
      <Link to={to}>
        {children}
      </Link>
    </div>
  )}/>
)
💻 Play with the code.

Just like that, we’ve created our own Link component and used React Router’s Route component to do some path checking for us.