Often times when building a web app, you’ll need to protect certain routes in your application from users who don’t have the proper authentication. Though React Router doesn’t provide any functionality for this out of the box, because it was built with composability in mind, adding it is fairly straight forward.

Before we even go about creating our protected routes, we’ll need a way to figure out if the user is authenticated. Because this is a tutorial about React Router v4 protected routes and not about authentication, we’ll use a dummy object to mock our auth service.

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100) // fake async
  }
}
💻 Play with the code.

Now that that’s out of the way, let’s build out the components that’ll be rendered by React Router v4 when certain paths match - Public, Protected and Login.

Public and Protected are simple. Login will be a little more complex so we’ll build out the skeleton for it now and finish the rest later.

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
  render() {
    return (
      <div>
        Login
      </div>
    )
  }
}
💻 Play with the code.

Now that we have some components, the next step is to start rendering some Routes.

Before we start worrying about creating any protected routes, let’s render the Routes for /public and /login and the Links for /public and /protected.

export default function AuthExample () {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
        </ul>

        <Route path="/public" component={Public}/>
        <Route path="/login" component={Login}/>
      </div>
    </Router>
  )
}
💻 Play with the code.

Now the idea is that anyone will be able to access /public (and therefore see the Public component), but eventually, anyone who tries to access /protected who isn’t authenticated, will get redirected to /login.

So naturally, the next step is to render a Route with a path of /protected. The problem is that by rendering a normal Route, anyone will be able to access it, which obviously isn’t what we want.

It would be nice if, just like React Router v4 gives us a Route component, they also gave us a PrivateRoute component which would render the component only if the user was authenticated.

Something like this

<Route path="/public" component={Public} />
<Route path="/login" component={Login} />
<PrivateRoute path='/protected' component={Protected} />
Unfortunately, they don’t. However, the good news is that Route is composable. That means wee can create our PrivateRoute implementation which handles our own specific use cases.

Here are the requirements for our PrivateRoute component.

It has the same API as <Route />.
It renders a <Route /> and passes all the props through to it.
It checks if the user is authenticated. If they are, it renders the “component” prop. If not, it redirects the user to /login.
With those requirements in mind, let’s build it out.

// Requirement 1.
// It has the same API as <Route />

const PrivateRoute = ({ component: Component, ...rest }) => (

)
// Requirement 2.
// It renders a <Route /> and passes all the props through to it.

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={} />
)
// Requirement 3.
// It checks if the user is authenticated, if they are,
// it renders the "component" prop. If not, it redirects
// the user to /login.

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)
💻 Play with the code.

A few notes on the above code. With Route, if a path isn’t supplied, then that Route will always match. So in the case above, because we didn’t supply a path prop, the Route will always match which means the render prop will always be called. Then, depending on the auth status of the user, we’ll either render a Redirect or render the component (which is why we needed to destructure and rename the component prop in the function’s arguments).

At this point, you can see the PrivateRoute component in action if you try to click on the Protected Page link. You should be redirected to /login instead of being taken to the /protected route.

Now what we need to do is finish filling out our Login component so that we can actually authenticate.

First, let’s add a login method which calls fakeAuth.authenticate.

class Login extends React.Component {
  login = () => {
    fakeAuth.authenticate(() => {

    })
  }
  render() {
    return (
      <div>
        Login
      </div>
    )
  }
}
Now what we want to do is when the user authenticates (through the login method), they should be redirected to the home (/) page. There are a few different approaches to redirecting with React Router v4. You can use the imperative history.push method or you can use the declarative <Redirect /> component. In this case, let’s go with <Redirect />.

We’ll need to add a property to the component’s state that will clue us in to when we should render a <Redirect />.

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  render() {
    const { redirectToReferrer } = this.state

    if (redirectToReferrer === true) {
      return <Redirect to='/' />
    }

    return (
      <div>
        Login
      </div>
    )
  }
}
So now what we’re doing is when the user authenticates, we change redirectToReferrer to true which causes a re-render and then renders the <Redirect /> component taking the user to the / route.

Now we actually need to add the button so that the user can log in.

return (
  <div>
    <p>You must log in to view the page</p>
    <button onClick={this.login}>Log in</button>
  </div>
)
💻 Play with the code.

At this point, everything works great. When a user who isn’t authenticated tries to go to /protected, they’re redirected to /login. Then once they’re authenticated, they can access /protected.

There is one more addition we can make to make the UX a little better. You’ve probably experienced this very common UX fail before. You try to access a specific page, it redirects you to the login page, you authenticate, then, instead of taking you back to the initial page you were trying to access, it takes you to a completely unrelated page. Instead of being taken to an unrelated page, you should have been taken back to the initial page you were trying to access before you were redirected. At this point in our code, we’re also committing that UX fail. Let’s fix it.

First, inside of our PrivateRoute component, when we redirect the user for not being authenticated, we’ll need to pass along the current route they’re trying to visit so we can come back to it after they authenticate. We can do this by changing the Redirect's to prop from a string to an object and pass along a state key whose value is the current location of the route the user is trying to access.

<Redirect to={{
  pathname: '/login',
  state: { from: props.location }
}} />
Now we need to modify our Login component so that if the user was redirected there from a previous route, once they authenticate, they’re taken back to that original route.

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }))
    })
  }
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <div>
        <p>You must log in to view the page</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}
💻 Play with the code.

🎉. Now when the user authenticates, they’ll be taken back to the original route they were trying to access.

At this point we’re basically done. The only other feature we need to add the ability for users to log out. To do this, we’ll create an AuthButton component that if the user is logged in, will render a logout button and if they’re not logged in, will render text that says “You are not logged in”. The biggest gotcha of this component will be how we redirect once the user logs out.

With React Router v4 there are two ways to redirect. The first, and what you’ve seen in this post, is to render a Redirect component. The second, and what we’ll do in this component, is to use history.push. The problem we’re going to run into is that this AuthButton component isn’t going to be rendered by React Router. What that means is that it’s not going to be passed history, location, or match - which means we have no way to call history.push. We can get around this by using React Router v4’s withRouter higher order component which will give us access to those router props.

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated
    ? <p>
        Welcome! <button onClick={() => {
          fakeAuth.signout(() => history.push('/'))
        }}>Sign out</button>
      </p>
    : <p>You are not logged in.</p>
))
Now that we have our AuthButton component, all we have to do now is just render it.

export default function AuthExample () {
  return (
    <Router>
      <div>
        <AuthButton/>

        <ul>
          <li><Link to="/public">Public Page</Link></li>
          <li><Link to="/protected">Protected Page</Link></li>
        </ul>

        <Route path="/public" component={Public}/>
        <Route path="/login" component={Login}/>
        <PrivateRoute path='/protected' component={Protected} />
      </div>
    </Router>
  )
}
💻 Play with the code.

And with that, we’re all finished.

Here’s the obligatory comment where I say “You shouldn’t solely rely on front end authentication to protect your routes”. It’s just for UX purposes.