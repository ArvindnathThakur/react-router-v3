When building an app with React Router v4, sometimes you’ll need to pass props through the Link component to the new route. In this post, we’ll break down how that process works.

There are two different ways to pass data from the Link component through to the new route. The first is through URL Parameters and the second is through state.

First, let’s take a look at URL parameters. If you’ve read our URL Parameters post, you’ll be familiar with this example. Say we were in charge of building out the Route that renders Twitter’s profile page. If created with React Router v4, that Route would probably look something like this.

<Route path='/:handle' component={Profile} />
Notice that handle has a : in front of it, that’s because it’s going to be dynamic. It could be anything from tylermcginnis or dan_abramov to realDonaldTrump.

So in our app, we may have a Link component that looks like this.

<Link to='/tylermcginnis'>Tyler McGinnis</Link>
If clicked, the user would be taken to /tylermcginnis and the Profile component would be rendered. Profile would be able to access the dynamic URL parameter (tylermcginnis) from props.match.params.handle.

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
URL parameters are great, but they’re not meant to serve as a way to get data from one route to another as they’re limited to just strings. What if instead of just a string, we wanted to pass along something a little more complex, like an object or an array? There would be no way to do that with URL parameters. This brings us to the second way to pass data from one route to another and that’s with state.

Going back to our Twitter example from earlier, what if we wanted to pass along if the user is coming from a certain route? For example, say we wanted to know if the user is coming from the /notifications route when they click on the Link. To do this, instead of passing to as a string to Link, we can pass it an object with a pathname and a state property.

<Link to={{
  pathname: '/tylermcginnis',
  state: {
    fromNotifications: true
  }
}}>Tyler McGinnis</Link>
Now the question becomes, how does the component that’s being rendered when the user goes to /tylermcginnis get access to the fromNotifications property? Anytime you pass data along via the state property, that data will be available in the component as a property on props.location.state.

class Profile extends React.Component {
  state = {
    user: null
  }
  componentDidMount () {
    const { handle } = this.props.match.params
    const { fromNotifications } = this.props.location.state

    fetch(`https://api.twitter.com/user/${handle}`)
      .then((user) => {
        this.setState(() => ({ user }))
      })
  }
  render() {
    ...
  }
}
To recap, there are two ways to pass data from a Link through to the new route: URL parameters and state. URL parameters work great for strings, but aren’t meant for any other data types. By making the Links to prop an object, you can pass along any sort of data you need under the state property and that data can be accessed in the new route under props.location.state.