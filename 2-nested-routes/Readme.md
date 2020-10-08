o understand recursion, you first need to be familiar with functions, return values, and the call stack. Similar, to understand nested routes with React Router v4, you first need to be comfortable with React Router v4’s most fundamental component, Route.

Route allows you to map URL paths to different React components. For example, say we wanted to render the Dashboard component whenever a user navigates to the /home path. To do that, we’d render a Route that looks like this.

<Route path='/home' component={Dashboard} />
The mental model I use for Route is that it always has to render something, either the component if that path matches or null if it doesn’t.

I realize we’re starting off slow here, but if you fully grasp that last sentence, the rest of this tutorial will be 🍰.

With that out of the way, let’s take a look at the example we’ll be building to demonstrate nested routes. The idea is we have a list of topics, those topics have resources, and those resources have a URL.

Final App

Here’s the data structure we’ll be working with. Notice it maps pretty nicely to our final UI.

const topics = [
  {
    name: 'React Router',
    id: 'react-router',
    description: 'Declarative, component based routing for React',
    resources: [
      {
        name: 'URL Parameters',
        id: 'url-parameters',
        description: "URL parameters are parameters whose values are set dynamically in a page's URL. This allows a route to render the same component while passing that component the dynamic portion of the URL so it can change based off of it.",
        url: 'https://ui.dev/react-router-v4-url-parameters/'
      },
      {
        name: 'Programmatically navigate',
        id: 'programmatically-navigate',
        description: "When building an app with React Router, eventually you'll run into the question of navigating programmatically. The goal of this post is to break down the correct approaches to programmatically navigating with React Router.",
        url: 'https://ui.dev/react-router-v4-programmatically-navigate/'
      }
    ]
  },
  {
    name: 'React.js',
    id: 'reactjs',
    description: 'A JavaScript library for building user interfaces',
    resources: [
      {
        name: 'React Lifecycle Events',
        id: 'react-lifecycle',
        description: "React Lifecycle events allow you to tie into specific phases of a component's life cycle",
        url: 'https://ui.dev/an-introduction-to-life-cycle-events-in-react-js/'
      },
      {
        name: 'React AHA Moments',
        id: 'react-aha',
        description: "A collection of 'Aha' moments while learning React.",
        url: 'https://ui.dev/react-aha-moments/'
      }
    ]
  },
  {
    name: 'Functional Programming',
    id: 'functional-programming',
    description: 'In computer science, functional programming is a programming paradigm—a style of building the structure and elements of computer programs—that treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.',
    resources: [
      {
        name: 'Imperative vs Declarative programming',
        id: 'imperative-declarative',
        description: 'A guide to understanding the difference between Imperative and Declarative programming.',
        url: 'https://ui.dev/imperative-vs-declarative-programming/'
      },
      {
        name: 'Building User Interfaces with Pure Functions and Function Composition',
        id: 'fn-composition',
        description: 'A guide to building UI with pure functions and function composition in React',
        url: 'https://ui.dev/building-user-interfaces-with-pure-functions-and-function-composition-in-react-js/'
      }
    ]
  }
]
Before we start worrying about nested routes, let’s first create the skeleton of our app including the navbar which will allow us to navigate between Home (/) and Topics (/topics).

import React from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route // for later
} from 'react-router-dom'

const topics = [
  // ...
]

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{width: 1000, margin: '0 auto'}}>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/topics'>Topics</Link></li>
          </ul>
        </div>
      </Router>
    )
  }
}

export default App
💻 Play with the code.

Now what we want to do is render a few Routes so that we can map different components to the application’s path. However, before we can do that, we need to actually build out those components. As you saw earlier in the final version of our app, the two top-level components we’ll need are Home and Topics. For now, we’ll throw some placeholder text in both of them.

function Home () {
  return (
    <h1>
      HOME
    </h1>
  )
}

function Topics () {
  return (
    <h1>
      TOPICS
    </h1>
  )
}
Now that we have our two top-level components, we need to create a Route for each of them. Home will be rendered when the user is at / and Topics will be rendered when the user is at /topics.

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{width: 1000, margin: '0 auto'}}>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/topics'>Topics</Link></li>
          </ul>

          <hr />

          <Route exact path='/' component={Home} />
          <Route path='/topics' component={Topics} />
        </div>
      </Router>
    )
  }
}
💻 Play with the code.

When we’re at /, we’ll see the navbar and the Home component. When we’re at /topics, we’ll see the navbar and the Topics component.

Finally, we have a nice foundation to start talking about how we go about dealing with nested routes with React Router v4. Thanks for your patience 🤝.

If you look back to the final example, you’ll notice that when we go to /topics, the UI we get is another navbar which includes all of the topics. Let’s modify our Topics component to include this navbar. This time instead of hard-coding our Links, we’ll need to use our topics array to create a Link for each high-level topic.

function Topics () {
  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(({ name, id }) => (
          <li key={id}>
            <Link to={`/topics/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
💻 Play with the code.

Now, when we go to /topics and the Topics component is rendered, we’ll get three Links - each linking to a different high-level topic.

Notice where we’re linking to, /topics/${id}. If we’re going to link someone to /topics/${id}, that means we need to render a Route which is going to match at that path. This is the first big concept of nested routes with React Router v4 - it doesn’t matter if you render a Route in your main component or in a child component, if the path matches the app’s location, the component will be rendered.

With that in mind, let’s create a Route to match the Links we just created.

function Topic () {
  return (
    <div>
      TOPIC
    </div>
  )
}

function Topics () {
  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(({ name, id }) => (
          <li key={id}>
            <Link to={`/topics/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route path={`/topics/:topicId`} component={Topic}/>
    </div>
  )
}
💻 Play with the code.

This is why understanding Route was so important. The mental model for Route is still the exact same, but for some reason your brain gets all worked up the first time you render a Route outside of the main App component.

Here’s a step by step step walk-through of what’s happening. When we go to /topics, the Topic component is rendered. Topics then renders a navbar and a new Route which will match for any of the Links in the navbar we just rendered (since the Links are linking to /topics/${id} and the Route is matching for /topics/:topicId). This means that if we click on any of the Links in the Topics component, the Topic component is going to be rendered.

It’s important to note that just because we matched another Route component, that doesn’t mean the previous Routes that matched aren’t still rendered. This is what confuses a lot of people. Remember, Route will always render something, either a component if the path matches or null. The same way you think of nesting normal components in React can apply directly to nesting Routes.

At this point, we’re progressing along nicely. What if, for some reason, another member of your team who wasn’t familiar with React Router decided to change /topics to /concepts? They’d probably head over to the main App component and change the Route

// <Route path='/topics' component={Topics} />
<Route path='/concepts' component={Topics} />
NBD, right? Well, now our routing is all broken. Inside of the Topics component, we’re assuming that the path begins with /topics but now it’s been changed to /concepts. Instead of hard coding the initial path, what we need is a way for the Topics component to receive whatever the initial path is as a prop. That way, regardless of if someone changes the parent Route, it’ll always work. Good news for us is React Router does exactly this. Each time a component is rendered with React Router v4, that component is passed three props - location, match, and history. The one we care about is match. match is going to contain information about how the Route was matched. Specifically, it has two properties we need, path and url. These are very similar, this is how the docs describe them -

path - The path pattern used to match. Useful for building nested <Route>s

url - The matched portion of the URL. Useful for building nested <Link>s

There’s one important insight in those definitions. Use match.path for building nested Routes and use match.url for building nested Links.

The best way to answer “why” is to look at an example.

If you’re not familiar with URL Parameters, head over to React Router: URL Parameters before continuing.

Assume we were using an app that had nested route’s and the current URL was /topics/react-router/url-parameters.

If we were to log match.path and match.url in the most nested component, here’s what we would get.

render() {
  const { match } = this.props // coming from React Router v4.

  console.log(match.path) // /topics/:topicId/:subId

  console.log(match.url) // /topics/react-router/url-parameters

  return ...
}
Notice that path is including the URL parameters and url is just the full URL. This is why one is used for Links and the other used for Routes.

When you’re creating a nested Link, you don’t want to include the URL parameters. You want the user to literally go to /topics/react-router/url-parameters. That’s why match.url is better for nested Links. However, when you’re matching certain patterns with Route, you want to include the URL parameters - that’s why match.path is used for nested Routes.

Let’s head back to our example. As of right now, we’re hard-coding /topics into our Route and Links.

function Topics () {
  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(({ name, id }) => (
          <li key={id}>
            <Link to={`/topics/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route path={`/topics/:topicId`} component={Topic}/>
    </div>
  )
}
💻 Play with the code.

As we just learned, we want our nested Route's path to be dynamic instead of hard coded. To do this, we can replace the /topics portion of our Link with match.url and the /topics portion of our Route with match.path.

function Topics ({ match }) {
  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(({ name, id }) => (
          <li key={id}>
            <Link to={`${match.url}/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route path={`${match.path}/:topicId`} component={Topic}/>
    </div>
  )
}
💻 Play with the code.

At this point, our app is about halfway done. We still need to add a few more layers of nesting. Here’s the good news - there’s nothing more you’re going to learn in this tutorial. We’ll continue to create new nested navbars, continue to render Routes and we’ll continue to use match.url and match.path. If you’re comfortable at this point, the rest is gravy.

Now just as we initially did with the Topics component, we want to make it so Topic (no s) will also render a nested navbar and a Route. The only difference is now we’re one level deeper so we’ll map over the topic's resources for our Links and our Route will match at /topics/:topicId/subId.

function Resource () {
  return <p>RESOURCE</p>
}

function Topic ({ match }) {
  const topic = topics.find(({ id }) => id === match.params.topicId)

  return (
    <div>
      <h2>{topic.name}</h2>
      <p>{topic.description}</p>

      <ul>
        {topic.resources.map((sub) => (
          <li key={sub.id}>
            <Link to={`${match.url}/${sub.id}`}>{sub.name}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route path={`${match.path}/:subId`} component={Resource} />
    </div>
  )
}
💻 Play with the code.

Finally, the last thing we need to do it finish out our Resource component. Because this is the last child component, we’ll no longer be rendering any more Links or Routes. Instead, we’ll just give it a basic UI including the name of the resource, the description, and a (normal) link.

function Resource ({ match }) {
  const topic = topics.find(({ id }) => id === match.params.topicId)
    .resources.find(({ id }) => id === match.params.subId)

  return (
    <div>
      <h3>{topic.name}</h3>
      <p>{topic.description}</p>
      <a href={topic.url}>More info.</a>
    </div>
  )
}
💻 Play with the code.

Here’s the full code.

import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const topics = [
  {
    name: 'React Router',
    id: 'react-router',
    description: 'Declarative, component based routing for React',
    resources: [
      {
        name: 'URL Parameters',
        id: 'url-parameters',
        description: "URL parameters are parameters whose values are set dynamically in a page's URL. This allows a route to render the same component while passing that component the dynamic portion of the URL so it can change based off of it.",
        url: 'https://ui.dev/react-router-v4-url-parameters/'
      },
      {
        name: 'Programmatically navigate',
        id: 'programmatically-navigate',
        description: "When building an app with React Router, eventually you'll run into the question of navigating programmatically. The goal of this post is to break down the correct approaches to programmatically navigating with React Router.",
        url: 'https://ui.dev/react-router-v4-programmatically-navigate/'
      }
    ]
  },
  {
    name: 'React.js',
    id: 'reactjs',
    description: 'A JavaScript library for building user interfaces',
    resources: [
      {
        name: 'React Lifecycle Events',
        id: 'react-lifecycle',
        description: "React Lifecycle events allow you to tie into specific phases of a components lifecycle",
        url: 'https://ui.dev/an-introduction-to-life-cycle-events-in-react-js/'
      },
      {
        name: 'React AHA Moments',
        id: 'react-aha',
        description: "A collection of 'Aha' moments while learning React.",
        url: 'https://ui.dev/react-aha-moments/'
      }
    ]
  },
  {
    name: 'Functional Programming',
    id: 'functional-programming',
    description: 'In computer science, functional programming is a programming paradigm—a style of building the structure and elements of computer programs—that treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.',
    resources: [
      {
        name: 'Imperative vs Declarative programming',
        id: 'imperative-declarative',
        description: 'A guide to understanding the difference between Imperative and Declarative programming.',
        url: 'https://ui.dev/imperative-vs-declarative-programming/'
      },
      {
        name: 'Building User Interfaces with Pure Functions and Function Composition',
        id: 'fn-composition',
        description: 'A guide to building UI with pure functions and function composition in React',
        url: 'https://ui.dev/building-user-interfaces-with-pure-functions-and-function-composition-in-react-js/'
      }
    ]
  }
]

function Resource ({ match }) {
  const topic = topics.find(({ id }) => id === match.params.topicId)
    .resources.find(({ id }) => id === match.params.subId)

  return (
    <div>
      <h3>{topic.name}</h3>
      <p>{topic.description}</p>
      <a href={topic.url}>More info.</a>
    </div>
  )
}

function Topic ({ match }) {
  const topic = topics.find(({ id }) => id === match.params.topicId)

  return (
    <div>
      <h2>{topic.name}</h2>
      <p>{topic.description}</p>

      <ul>
        {topic.resources.map((sub) => (
          <li key={sub.id}>
            <Link to={`${match.url}/${sub.id}`}>{sub.name}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route path={`${match.path}/:subId`} component={Resource} />
    </div>
  )
}

function Topics ({ match }) {
  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map(({ name, id }) => (
          <li key={id}>
            <Link to={`${match.url}/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route path={`${match.path}/:topicId`} component={Topic}/>
    </div>
  )
}

function Home () {
  return (
    <h1>
      Home.
    </h1>
  )
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{width: 1000, margin: '0 auto'}}>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/topics'>Topics</Link></li>
          </ul>

          <hr />

          <Route exact path='/' component={Home} />
          <Route path='/topics' component={Topics} />
        </div>
      </Router>
    )
  }
}

export default App