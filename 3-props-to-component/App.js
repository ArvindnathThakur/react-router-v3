import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const newsletters = [
  {
    name: 'React Newsletter',
    id: 'react',
    description: 'The free, weekly newsletter of the best React news, articles, projects, and more.',
    issues: [
      {
        name: '#1',
        id: '1',
        links: [
          {
            title: 'Why React Hooks?',
            url: 'https://ui.dev/why-react-hooks/',
          },
          {
            title: 'React Render Props',
            url: 'https://ui.dev/react-render-props/',
          },
          {
            title: 'React Higher-order Components',
            url: 'https://ui.dev/react-higher-order-components/',
          }
        ]
      },
      {
        name: '#2',
        id: '2',
        links: [
          {
            title: 'Compiling vs Polyfills with Babel',
            url: 'https://ui.dev/compiling-polyfills/',
          },
          {
            title: 'Build your own React Router v4',
            url: 'https://ui.dev/build-your-own-react-router-v4/',
          },
          {
            title: 'React AHA Moments',
            url: 'https://ui.dev/react-aha-moments/',
          }
        ]
      },
    ]
  },
  {
    name: 'UI Newsletter',
    id: 'ui',
    description: 'The free, weekly newsletter of the best UI news, articles, projects, and more.',
    issues: [
      {
        name: '#1',
        id: '1',
        links: [
          {
            title: 'Computed Property Names in JavaScript',
            url: 'https://ui.dev/computed-property-names/',
          },
          {
            title: 'Imperative vs Declarative Programming',
            url: 'https://ui.dev/imperative-vs-declarative-programming/',
          },
          {
            title: 'AngularJS: Factory vs Service vs Provider',
            url: 'https://ui.dev/angularjs-factory-vs-service-vs-provider/',
          }
        ]
      },
      {
        name: '#2',
        id: '2',
        links: [
          {
            title: 'Shorthand Property and Method Names in JavaScript',
            url: 'https://ui.dev/shorthand-properties/',
          },
          {
            title: 'JavaScript Inheritance vs Composition',
            url: 'https://ui.dev/javascript-inheritance-vs-composition/',
          },
          {
            title: 'var vs let vs const in JavaScript',
            url: 'https://ui.dev/var-let-const/',
          }
        ]
      },
    ]
  }
]


function Issue ({ match, issues }) {
  const { name, links } = issues.find(({ id }) => id === match.params.issue)

  return (
    <div>
      <h3>{name}</h3>
      <ul>
        {links.map(({ title, url}) => (
          <li key={title}>
            <a href={url}>{title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Publication ({ match }) {
  const { name, description, issues } = newsletters.find(({ id }) => id === match.params.id)

  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>

      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <Link to={`${match.url}/${issue.id}`}>{issue.name}</Link>
          </li>
        ))}
      </ul>

      <hr />

      <Route 
        path={`${match.path}/:issue`} 
        render={({ match }) => <Issue match={match} issues={issues} />} 
      />
    </div>
  )
}

function Newsletters ({ match }) {
  return (
    <div>
      <h1>Newsletters</h1>
      <ul>
        {newsletters.map(({ name, id, description }) => (
          <li key={id}>
            <Link to={`${match.url}/${id}`}>{name}</Link>
            <p>{description}</p>
          </li>
        ))}
      </ul>

      <hr />

      <Route path={`${match.path}/:id`} component={Publication} />
    </div>
  )
}

function Home() {
  return (
    <h1>
      HOME
    </h1>
  )
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ width: 1000, margin: '0 auto' }}>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/newsletters'>Newsletters</Link></li>
          </ul>

          <hr />

          <Route exact path='/' component={Home} />
          <Route path='/newsletters' component={Newsletters} />
        </div>
      </Router>
    )
  }
}

export default App