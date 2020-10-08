Recursive routes aren’t the most pragmatic thing in the world, but they really show off the benefits of React Router v4’s component-based approach to routing.

The main idea here is that since React Router v4 is just components, theoretically, you can create recursive, and therefore infinite routes. The secret lies in setting up the right data structure which can lead to the infinite routes. In this example, we’ll use an array of users who all have an id, a name, and an array of friends.

const users = [
  { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
  { id: 1, name: 'Sean', friends: [ 0, 3 ] },
  { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
  { id: 3, name: 'David', friends: [ 1, 2 ] }
]
By having this data structure set up this way, when we render a Person, we’ll render all of their friends as Links. Then, when a Link is clicked, we’ll render all of that person’s friends as Links, and on and on. Each time a Link is clicked, the app’s pathname will become progressively longer.

Initially, we’ll be at / and the UI will look like this

Michelle's Friends

  * Sean
  * Kim
  * David
If Kim is clicked, then the URL will change to /2 (Kim’s id) and the UI will look like this

Michelle's Friends

  * Sean
  * Kim
  * David

Kim's Friends

  * Michelle
  * Sean
  * David
If David is clicked, then the URL will change to /2/3 (Kim’s id then David’s id) and the UI will look like this

Michelle's Friends

  * Sean
  * Kim
  * David

Kim's Friends

  * Michelle
  * Sean
  * David

David's Friends

  * Sean
  * Kim
And this process repeats for as long as the user wants to click on Links.

Once you have the right data structure set up, the next important step is to continually render a Route and some Linkss. Because we’re creating infinite routes, we’ll need to make sure we have a Route that is rendered every time a Link is clicked. If not, we won’t get any more matches which means React Router won’t render any more components.

In both our Link and our Route, we’ll need to know the app’s current pathname so that we can append to it every time a Link is clicked (like in the example above, we went from /2 to /2/3, and on). Luckily for us, React Router v4 gives us the pathname with match.url. With that in mind, the initial part of our Link will look like this

<Link to={`{match.url}/${id}}>
and the Route we render will match on the same pattern then render the same component.

<Route path={`${match.url}/:id`} component={Person}/>
Now that we have the basics down, let’s start building out the component which is going to be recursively rendered, Person.

Remember, there are a few things this component needs to be responsible for.

It should render a Link component for every one of that specific person’s friends.
It should render a Route component which will match for the current pathname + /:id.
As with all recursive problems, we need to somehow “kick off” the recursion. Typically this involves invoking the function but if it’s a component that’s being called recursively, we can do that by simply creating the element.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const users = [
  { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
  { id: 1, name: 'Sean', friends: [ 0, 3 ] },
  { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
  { id: 3, name: 'David', friends: [ 1, 2 ] }
]

const Person = ({ match }) => {
  return (
    <div>
      PERSON
    </div>
  )
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <Person />
      </Router>
    )
  }
}

export default App
💻 Play with the code.

Now what we need to do is figure out how to get the specific friend’s information from our users array so we can grab their name and render their friends.

You may notice a problem here. Eventually Person is going to be rendered by React Router so it’ll be passed a match prop. It’s this match prop we’ll use to get the current pathname and (with help from users) the person’s name and friends list. The problem is we’re rendering Person manually inside the main App component to kick off the recursion. That means match is going to be undefined the first time Person is rendered. The solution to this problem is simpler than it may seem. When we first manually render <Person />, we’ll need to pass it a match prop just as React Router v4 would.

class App extends React.Component {
  render() {
    return (
      <Router>
        <Person match={{ params: { id: 0 }, url: '' }}/>
      </Router>
    )
  }
}
Now, every time Person is rendered, including the first time, it’ll be passed a match prop which will contain two things we need, url for rendering our Route and Links and params.id so we can figure out which person is being rendered.

Alright back to the main goal at hand. Person needs to

render a Link component for every one of that specific person’s friends.
render a Route component which will match for the current pathname + /:id.
Let’s tackle #1. Before we can render any Links, we need to get the person’s friends. We already know the person’s id from match.params.id. Using that knowledge with the Array.find method means getting the friends info should be pretty straight forward. We’ll create a helper function for it.

const users = [
  { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
  { id: 1, name: 'Sean', friends: [ 0, 3 ] },
  { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
  { id: 3, name: 'David', friends: [ 1, 2 ] }
]

const find = (id) => users.find(p => p.id == id)

const Person = ({ match }) => {
  const person = find(match.params.id)

  return (
    <div>
      PERSON
    </div>
  )
}
💻 Play with the code.

Slowly getting there. Now we have the person, let’s render some UI including the Link for each of their friends.

const Person = ({ match }) => {
  const person = find(match.params.id)

  return (
    <div>
      <h3>{person.name}’s Friends</h3>
      <ul>
        {person.friends.map((id) => (
          <li key={id}>
            <Link to={`${match.url}/${id}`}>
              {find(id).name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
💻 Play with the code.

We’re so close to being done. Now that we have a Link for each of the person’s friends, as mentioned in #2, we need to make sure we also render a Route.

const Person = ({ match }) => {
  const person = find(match.params.id)

  return (
    <div>
      <h3>{person.name}’s Friends</h3>
      <ul>
        {person.friends.map((id) => (
          <li key={id}>
            <Link to={`${match.url}/${id}`}>
              {find(id).name}
            </Link>
          </li>
        ))}
      </ul>

      <Route path={`${match.url}/:id`} component={Person}/>
    </div>
  )
}
💻 Play with the code.

The first time Person is rendered, we pass it a mock match object. Then, Person renders a list of Links as well as a Route matching any of those Links. When a Link is clicked, the Route matches which renders another Person component which renders a list of Links and a new Route. This process continues as long as the user continues to click on any Links.