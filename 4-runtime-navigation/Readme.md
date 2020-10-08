What I love about React Router is its dedication to declarative, “React like” code. The whole goal of the redesign to React Router v4 was to align React Router’s vision with React’s. Fundamentally, what this means is that the same mental model that applies to React should also apply to React Router.

If you broke React down into three core principles, you’d get component composition, declarative UI, and state management - specifically, user event -> state change -> re-render. Because React Router’s vision is aligned with React’s, programmatically navigating with React Router should, by definition, align with those three core concepts. The reason I’m emphasizing this is because your initial reaction to what’s coming next will most likely be negative.

The primary way you programmatically navigate using React Router v4 is by using a <Redirect /> component.

Let’s look at an example then we’ll walk through more of why this isn’t as crazy as it may first appear.

The typical use case for routing programmatically is routing on some sort of user event that isn’t a Link click. So in our example, let’s navigate the user to /dashboard once they’ve registered for our app.

class Register extends React.Component {
  state = {
    toDashboard: false,
  }
  handleSubmit = (user) => {
    saveUser(user)
      .then(() => this.setState(() => ({
        toDashboard: true
      })))
  }
  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to='/dashboard' />
    }

    return (
      <div>
        <h1>Register</h1>
        <Form onSubmit={this.handleSubmit} />
      </div>
    )
  }
}
After reading that, there’s at least a small chance that you hate it. Instead of using an imperative API (history.push), we’re using a declarative Redirect component. Again, the reason for this is because it aligns exactly with the principles of React itself.

<Redirect /> is

Composable ✅
Declarative ✅
user event -> state change -> re-render ✅
What are the downsides to this approach? The most often heard criticism is that you need to create a new property on the component’s state in order to know when to render the Redirect component. That’s valid, but again, that’s pretty much the whole point of React - state changes update the UI. “It’s more typing”, yes. Naturally, by explicitly defining and modifying your state, you have to type more. However, I’d argue that explicit state leading to a declarative API is better than implicit state handled by an imperative API.

Steps off high horse

Let’s take a look at the other approach now.

The real workhorse of React Router is the History library. Under the hood, it’s what’s keeping track of session history for React Router. When React Router v4 renders a component, it’ll pass that component three props: location, match, and history. This history prop comes from the History library and has a ton of fancy properties on it related to routing. In this case, the one we’re interested in is history.push. What it does is it pushes a new entry into the history stack - aka redirecting the user to another route.

Going back to our example from earlier, assuming the Register component is being rendered by React Router, our code could look like this.

class Register extends React.Component {
  handleSubmit = (user) => {
    saveUser(user).then(() =>
      this.props.history.push('/dashboard')
    ))
  }
  render() {
    return (
      <div>
        <h1>Register</h1>
        <Form onSubmit={this.handleSubmit} />
      </div>
    )
  }
}
Easy peasy. Worse, IMO. But, easy peasy.

Now, what if the Register component wasn’t being rendered by React Router? (Meaning, we’re not passing Register as a component prop to a Route. Instead, we’re just rendering it ourselves like <Register />). If it’s not rendered by React Router, then we won’t have access to history, match, or location, which means we also won’t have access to history.push. To fix this and get access to those props, you can use the withRouter higher-order component.

Going back to our Register code above, by adding withRouter, it would look like this

import { withRouter } from 'react-router-dom'
class Register extends React.Component {
  handleSubmit = (user) => {
    saveUser(user).then(() =>
      this.props.history.push('/dashboard')
    ))
  }
  render() {
    return (
      <div>
        <h1>Register</h1>
        <Form onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default withRouter(Register)
So there you have it. There are two ways to programmatically navigate with React Router v4 - <Redirect /> and history.push. Which you use is mostly up to you and your specific use case, though I try to favor Redirect as it’s more declarative.