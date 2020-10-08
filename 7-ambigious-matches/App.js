import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

const invoices = [
  {
    id: 1,
    account: 'Google',
    amount: 5000
  },
  {
    id: 2,
    account: 'Netflix',
    amount: 7000
  },
  {
    id: 3,
    account: 'UI',
    amount: 2300
  }
]

const Home = () => <h2>Home</h2>

const Statements = () => (
  <React.Fragment>
    <h2>Statements</h2>
    <ul>
      {invoices.map(({ id, account, amount }) => (
        <li key={id}>
          <Link to={`/${id}`}>#{id}</Link>
        </li>
      ))}
    </ul>
  </React.Fragment>
)

const Invoice = ({ match }) => {
  const { account, id, amount } = invoices.find(({ id }) => id === Number(match.params.id))

  return (
    <div>
      <h2>#{id}</h2>
      <h4>{account} - ${amount.toLocaleString()}</h4>
    </div>
  )
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/statements">Statements</Link></li>
          </ul>

          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/statements' component={Statements} />
            <Route path='/:id' component={Invoice} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
