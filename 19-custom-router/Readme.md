I still remember the feelings when I first started learning about routing in client side applications. At the time I was just a wee lad still getting my feet wet with this whole “Single Page Application” thing and I’d be lying if I said it didn’t take a poop all over my brain. From the beginning it’s as if my brain treated my application code and my router code as two unique and distinct ideas. They were like step brothers who didn’t like each other but were forced to live together anyway.

Over the last few years I have, probably at this point against your approval, been fortunate enough to be able to teach this idea of routing to other developers. Unfortunately, it turns out that most of our brains seem to be wired similarly to mine. I think there’s a few reasons for this. First, routing in general is pretty complex. This makes, for those library authors, finding the right abstraction over routing even more complex. Second, because of this complexity, consumers of routing libraries tend to blindly trust the abstraction without really understanding what’s going on under the hood. In this tutorial, we’ll dive into solving both problems. First the later by recreating our own simplified version of React Router v4 which will then shed some light on the former, that is, whether or not RRv4 is a reasonable abstraction.

Here’s the app we’re going to be building in order to test our implementation of React Router.

const Home = () => <h2>Home</h2>
const About = () => <h2>About</h2>
const Topic = ({ topicId }) => <h3>{topicId}</h3>

const Topics = ({ match }) => {
  const items = [
    { name: 'Rendering with React', slug: 'rendering' },
    { name: 'Components', slug: 'components' },
    { name: 'Props v. State', slug: 'props-v-state' },
  ]

  return (
    <div>
      <h2>Topics</h2>
      <ul>
        {items.map(({ name, slug }) => (
          <li key={name}>
            <Link to={`${match.url}/${slug}`}>{name}</Link>
          </li>
        ))}
      </ul>
      {items.map(({ name, slug }) => (
        <Route key={name} path={`${match.path}/${slug}`} render={() => (
          <Topic topicId={name} />
        )} />
      ))}
      <Route exact path={match.url} render={() => (
        <h3>Please select a topic.</h3>
      )} />
    </div>
  )
}

export default function App () {
  return (
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  )
}
💻 Play with the code.

If you’re unfamiliar with React Router v4, here’s the basic premise. Routes render some UI when a URL matches a location you specify in the Route’s path prop. Links provide a declarative, accessible way to navigate around your app. In other words, the Link component allows you to update the URL, and the Route component changes your UI based on that new URL.

The focus of this tutorial isn’t actually on teaching the basics of React Router v4, so if the code above is still confusing, start with React Router v4: Philosophy and Introduction first.

The first thing you should notice is that we’ve introduced two components that were given to us by the router into our app, Link and Route. My favorite aspect of React Router v4 is that the API is “Just Components™”. What this means is that if you’re already familiar with React, the same intuition you have about components and how to compose them, will continue to hold true in regards to your routing code. And even more convenient for our use case here, because we’re already familiar with how to create components, creating our own React Router will be nothing more than doing what we’re already familiar with, creating more components.

We’re going to start off by creating our Route component. Before we dive into the code, let’s go ahead and check out the API (which conveniently is just which props it takes).

In our example above, you’ll notice that <Route> can take in three props. exact, path, and component. This means the propTypes for our Route component currently look like this,

Route.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  component: PropTypes.func,
}

There’s a few subtleties here. First, the reason path isn’t required is because if a Route isn’t given a path, it will automatically be rendered. Second, the reason component isn’t marked as required either is because there are actually a few different ways to tell React Router the UI you want to render if the path matches. One way that isn’t in our example above is with the render prop. It looks like this,

<Route path='/settings' render={({ match }) => {
  return <Settings authed={isAuthed} match={match} />
}} />
render allows you to conveniently inline a function which returns some UI rather than creating a separate component. So we’ll add that to our propTypes as well,

Route.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
}
Now we know what props Route receives, let’s talk again about what it actually does. Route “renders some UI when the URL matches a location you specify in the Route’s path prop”. Based off of that definition, we know that <Route> is going to need some functionality which checks if the current URL matches the component’s path prop. If it does, we’ll render some UI. If it doesn’t, we’ll do nothing by returning null.

Let’s see what this looks like in code, trusting that we’ll build out the matching function, which we’ll call matchPath, later.

class Route extends React.Component {
  render() {
    const {
      path,
      exact,
      component,
      render,
    } = this.props

    const match = matchPath(
      window.location.pathname, // global variable
      { path, exact }
    )

    if (!match)
      // Do nothing because the current
      // location doesn't match the path prop.

      return null
    }

    if (component)
      // The component prop takes precedent over the
      // render method. If the current location matches
      // the path prop, create a new element passing in
      // match as the prop.

      return React.createElement(component, { match })

    if (render) {
      // If there's a match but component
      // was undefined, invoke the render
      // prop passing in match as an argument.

      return render({ match })
    }

    return null
  }
}

Route.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
}
Now Route is looking pretty solid. If the current location matches the path prop that was passed in, we render some UI, if not, we don’t do anything.

Let’s take a step back for a moment and talk about routing in general. In a client side application, there are really only two ways for the user to update the URL. The first way is clicking on an anchor tag and the second is by clicking the back/forward button. Foundationally, our router needs to be aware of the current URL and render UI based on it. What this also means is that our router needs to be aware of when the URL changes, so that it can figure out which new UI to display based on that new URL. If we know that the only way to update a URL is through an anchor tag or the forward/back button, we can plan for and react to those changes. We’ll get into anchor tags a little later when we build out our <Link> component, but for now, I want to focus on the back/forward buttons. React Router uses History’s .listen method to listen to changes for the current URL, but to avoid bringing in another library, we’ll use HTML5’s popstate event. popstate, which will be fired whenever the user clicks on the forward or back button, is exactly what we need. Because it’s the Routes that are rendering the UI based off the current URL, it makes sense to also give Routes the ability to listen for and re-render whenever a popstate event occurs. By re-rendering, each Route will re-check to see if they match with the new URL. If they do, they’ll render UI, if not, they’ll do nothing. Let’s see what this looks like now,

class Route extends React.Component {
  componentDidMount() {
    window.addEventListener("popstate", this.handlePop)
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePop)
  }

  handlePop = () => {
    this.forceUpdate()
  }

  render() {
    const {
      path,
      exact,
      component,
      render,
    } = this.props

    const match = matchPath(window.location.pathname, { path, exact })

    if (!match)
      return null

    if (component)
      return React.createElement(component, { match })

    if (render)
      return render({ match })

    return null
  }
}

Route.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
}
You should notice that all we’ve done is add a popstate listener when the component mounts, and when the popstate event is fired, we call forceUpdate which will kick off a re-render.

Now, no matter how many <Route>s we’re rendering, each of them will listen for, re-match, and re-render based on the forward/back buttons.

One thing we’ve been “hand waving” over up until this point has been our matchPath function. This function is pivotal to our router because it’s the function which is going to decide if a current URL matches the path of a <Route> component as we talked about above. One nuance to matchPath is we need to make sure that we take into account <Route>s exact prop. If you’re not familiar with what exact does, here’s an explanation straight from the docs

When true, will only match if the path matches the window.location.pathname exactly.

path	window.location.pathname	exact	matches?
/one	/one/two	true	no
/one	/one/two	false	yes
Now, let’s dive into the implementation of our matchPath function. If you look back at our Route component, you’ll see that the signature for matchPath looks like this,

const match = matchPath(window.location.pathname, { path, exact })
Where match is either an object or null depending on if there was a match. Based on that signature, we can build out the first part of matchPath like this,

const matchPath = (pathname, options) => {
  const { exact = false, path } = options
}
Here we’re using some ES6 magic. We’re saying “create a variable called exact which equates to options.exact, unless that’s undefined, then set it to false. Also create a variable called path which equates to options.path”.

Earlier I mentioned “the reason path isn’t required is because if a Route isn’t given a path, it will automatically be rendered”. Well since it’s indirectly our matchPath function which decides if something is rendered or not (by whether there’s a match), let’s add that functionality now.

const matchPath = (pathname, options) => {
  const { exact = false, path } = options

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
    }
  }
}
Now comes the matching part. React Router uses pathToRegex for this, we’ll simplify things and just use a simple Regex.

const matchPath = (pathname, options) => {
  const { exact = false, path } = options

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
    }
  }

  const match = new RegExp(`^${path}`).exec(pathname)

}
If you’re not familiar with .exec, it’s going to return an array containing the matched text if it finds a match, otherwise it returns null.

Here is every match when our example app routes to `/topics/components

path	window.location.pathname	return value
/	/topics/components	['/']
/about	/topics/components	null
/topics	/topics/components	['/topics']
/topics/rendering	/topics/components	null
/topics/components	/topics/components	['/topics/components']
/topics/props-v-state	/topics/components	null
/topics	/topics/components	['/topics']
Notice that we’re getting a match for every <Route> that’s in our app. That’s because, well, each <Route> calls matchPath in its render method.

Now that we know what the match that .exec is returning, all we need to do now is figure out if there’s a match.

const matchPath = (pathname, options) => {
  const { exact = false, path } = options

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true,
    }
  }

  const match = new RegExp(`^${path}`).exec(pathname)

  if (!match) {
    // There wasn't a match.
    return null
  }

  const url = match[0]
  const isExact = pathname === url

  if (exact && !isExact) {
    // There was a match, but it wasn't
    // an exact match as specified by
    // the exact prop.

    return null
  }

  return {
    path,
    url,
    isExact,
  }
}
Earlier I mentioned how there’s really just two ways to update the URL if you’re the user, via the back/forward buttons, or clicking on an anchor tag. We’ve taken care of re-rendering on back/forward clicks via the popstate event listener in our Route, now let’s take care of the anchor tag by building our our Link component.

The API for Link looks like this,

<Link to='/some-path' replace={false} />
Where to is a string and is the location to link to and replace is a boolean which when true, clicking the link will replace the current entry in the history stack instead of adding a new one.

Adding those propTypes to our Link component, we get this,

class Link extends Component {}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool,
}
Now we know that the render method in our Link component needs to return an anchor tag, but we obviously don’t want to cause a full page refresh every time we switch routes, so we’ll hijack the anchor tag by adding a onClick handler to it

class Link extends React.Component {
  handleClick = (event) => {
    const { replace, to } = this.props
    event.preventDefault()

    // route here.
  }

  render() {
    const { to, children} = this.props

    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    )
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool,
}
Now all that’s lacking is actually changing the current location. To do this React Router uses History’s push and replace methods, but we’ll use HTML5’s pushState and replaceState methods to avoid adding in a dependency.

We’re hand waving over the History library in this post as a way to avoid external dependencies but it’s crucial for the real React Router code as it normalizes the differences in managing session history in various browser environments.

Both pushState and replaceState take in three arguments. The first is an object which is associated with the new history entry - we don’t need this functionality so we’ll just pass in an empty object. The second is a title, which we also don’t need so we’ll pass in null. The third, and the one we’ll actually use, is a relative URL.

const historyPush = (path) => {
  history.pushState({}, null, path)
}

const historyReplace = (path) => {
  history.replaceState({}, null, path)
}
Now inside of our Link component, we’ll invoke historyPush or historyReplace depending on the replace prop,

class Link extends React.Component {
  handleClick = (event) => {
    const { replace, to } = this.props

    event.preventDefault()
    replace ? historyReplace(to) : historyPush(to)
  }

  render() {
    const { to, children } = this.props

    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    )
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool,
}
Now there’s just one more, albeit crucial addition we need to make. If you were to play around with our example app with our current router code, you’d notice a pretty big problem. When you navigate around, the URL would update, but the UI would stay exactly the same. This is because even though we’re changing the location with our historyReplace or historyPush functions, our <Route>s are unaware of that change and don’t know that they should re-render and re-match. To solve this problem, we need to keep track of which <Route>s have been rendered and call forceUpdate on them whenever a route changes.

React Router gets around this problem by using a combination of setState, context, and history.listen inside of a Router component you wrap your code with.

To keep our router simple, we’ll keep track of which <Route>s have been rendered by pushing their instances to an array, then whenever a location change occurs, we can loop through that array and call forceUpdate on all the instances.

let instances = []

const register = (comp) => instances.push(comp)
const unregister = (comp) => instances.splice(instances.indexOf(comp), 1)
Notice we’ve created two functions. We’ll call register whenever a <Route> is mounted and call unregister whenever it unmounts. Then, whenever we call historyPush or historyReplace (which we will every time a user clicks on a <Link>), we can loop through those instances and forceUpdate.

Let’s update our <Route> component first,

class Route extends React.Component {
  componentDidMount() {
    window.addEventListener("popstate", this.handlePop)
    register(this)
  }

  componentWillUnmount() {
    unregister(this)
    window.removeEventListener("popstate", this.handlePop)
  }

  ...
}
Now, let’s update historyPush and historyReplace

const historyPush = (path) => {
  history.pushState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}

const historyReplace = (path) => {
  history.replaceState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}
🎉 now whenever a <Link> is clicked and the location changes, each <Route> will be aware of that and re-match and re-render.

Now, our full router code looks like this code below, and our example app above works perfectly with it.

let instances = []

const register = (comp) => instances.push(comp)
const unregister = (comp) => instances.splice(instances.indexOf(comp), 1)

const historyPush = (path) => {
  window.history.pushState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}

const historyReplace = (path) => {
  window.history.replaceState({}, null, path)
  instances.forEach(instance => instance.forceUpdate())
}

const matchPath = (pathname, options) => {
  const { exact = false, path } = options

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true
    }
  }

  const match = new RegExp(`^${path}`).exec(pathname)

  if (!match)
    return null

  const url = match[0]
  const isExact = pathname === url

  if (exact && !isExact)
    return null

  return {
    path,
    url,
    isExact,
  }
}

class Route extends React.Component {
  componentDidMount() {
    window.addEventListener("popstate", this.handlePop)
    register(this)
  }

  componentWillUnmount() {
    unregister(this)
    window.removeEventListener("popstate", this.handlePop)
  }

  handlePop = () => {
    this.forceUpdate()
  }

  render() {
    const {
      path,
      exact,
      component,
      render,
    } = this.props

    const match = matchPath(window.location.pathname, { path, exact })

    if (!match)
      return null

    if (component)
      return React.createElement(component, { match })

    if (render)
      return render({ match })

    return null
  }
}

Route.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
}

class Link extends React.Component {
  handleClick = (event) => {
    const { replace, to } = this.props

    event.preventDefault()
    replace ? historyReplace(to) : historyPush(to)
  }

  render() {
    const { to, children } = this.props

    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    )
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool,
}
💻 Play with the code.

Bonus: The React Router API also comes with a <Redirect> component. Using the code we’ve previously written, creating this component is pretty straight forward

class Redirect extends React.Component {
  componentDidMount() {
    const { to, push } = this.props

    push ? historyPush(to) : historyReplace(to)
  }

  render() {
    return null
  }
}

Redirect.defaultProps = {
  push: false
}

Redirect.propTypes = {
  to: PropTypes.string.isRequired,
  push: PropTypes.bool.isRequired,
}
Notice this component isn’t actually rendering any UI, instead, it’s acting purely as a route director, hence the name.

I hope this has helped you create a better mental model of what’s happening in React Router while also helping you to gain an appreciation for React Router’s elegance and “Just Components” API. I’ve always said that React will make you a better JavaScript developer. I now also believe that React Router will make you a better React developer. Because everything is just components, if you know React, you know React Router.