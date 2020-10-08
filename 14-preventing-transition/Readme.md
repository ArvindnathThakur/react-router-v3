Respecting your user’s input is not only a solid business decision, but it also shows you care about little UX details. One of the most frustrating experiences a user can have is when they spend time inputting data into your app, accidentally hit a hotkey to navigate away from the current route, then have to restart the form all over. There are a few different approaches to fixing this bad UX but in this post, we’ll focus on how React Router v4 can help by warning before a route transition.

Before we can see how it’s done, we’ll need the basic skeleton of an app. Our app will be pretty straight forward. It will have a few different routes - one of which will render a form.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

class Form extends React.Component {
  render() {
    return (
      <form>

      </form>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Form</Link></li>
            <li><Link to="/one">One</Link></li>
            <li><Link to="/two">Two</Link></li>
          </ul>
          <Route path="/" exact component={Form}/>
          <Route path="/one" render={() => <h3>One</h3>}/>
          <Route path="/two" render={() => <h3>Two</h3>}/>
        </div>
      </Router>
    )
  }
}

export default App
💻 Play with the code.

Now the goal is to make it so if the form is “dirty” and the user tries to navigate away, we verify that’s what they’re really trying to do.

What I love about React Router v4 is its dedication to declarative, “React like” code. The fundamental aspect of React is user event -> state change -> re-render. With that in mind, it would make sense that the “React way” of preventing transitions follows that same paradigm - a declarative component we can render (or not) based off of the component’s state.

First, as mentioned, let’s add some state to the Form component. The goal here is to have some state which knows if the form is “dirty” (meaning the length of the value in the input field is > 0).

class Form extends React.Component {
  state = {
    isBlocking: false
  }
  render() {
    return (
      <form>
        <p>
          Blocking? {
            this.state.isBlocking
              ? 'Yes, click a link or the back button'
              : 'Nope'
            }
        </p>

        <p>
          <input
            size="50"
            placeholder="type something to block transitions"
            onChange={(event) => this.setState({
              isBlocking: event.target.value.length > 0
            })}
          />
        </p>
      </form>
    )
  }
}
💻 Play with the code.

Now we have a property on our state, isBlocking, which tells us if we should warn the user before they transition away from the current route.

Next, we need to actually make it so the user is prompted if they try to navigate away and isBlocking is true. Conveniently, React Router v4 comes with a Prompt component that serves this exact purpose. It takes in two props - when and message. when needs to be a boolean that when true, will show the user a prompt with the message prop when they try to navigate away.

We’ve already added an isBlocking property to our state, so we can pass that to Prompts when prop.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Prompt,
} from 'react-router-dom'

...

class Form extends React.Component {
  state = {
    isBlocking: false
  }
  render() {
    const { isBlocking } = this.state

    return (
      <form>
        <Prompt
          when={isBlocking}
          message={(location) => `Are you sure you want to go to ${location.pathname}`}
        />
        <p>
          Blocking? {
            this.state.isBlocking
              ? 'Yes, click a link or the back button'
              : 'Nope'
            }
        </p>

        <p>
          <input
            size="50"
            placeholder="type something to block transitions"
            onChange={(event) => this.setState({
              isBlocking: event.target.value.length > 0
            })}
          />
        </p>
      </form>
    )
  }
}
💻 Play with the code.

Now if the input field if “dirty”, the Prompt component will warn the user if they try to navigate away from the current route.

Lastly, let’s finish the example by actually adding a button to our form and resetting isBlocking when the form is submitted.

class Form extends React.Component {
  state = {
    isBlocking: false
  }
  render() {
    const { isBlocking } = this.state

    return (
      <form onSubmit={(event) => {
        event.preventDefault()
        event.target.reset()
        this.setState({ isBlocking: false })
      }}
>
        <Prompt
          when={isBlocking}
          message={(location) => `Are you sure you want to go to ${location.pathname}`}
        />

        <p>
          Blocking? {
            this.state.isBlocking
              ? 'Yes, click a link or the back button'
              : 'Nope'
            }
        </p>

        <p>
          <input
            size="50"
            placeholder="type something to block transitions"
            onChange={(event) => this.setState(() => ({
              isBlocking: event.target.value.length > 0
            }))}
          />
        </p>

        <p>
          <button>Submit to stop blocking</button>
        </p>
      </form>
    )
  }
}