import React from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route
} from 'react-router-dom'

const Student = ({ match }) => (
  <h3>Student: {match.params.name}</h3>
)

const Invoice = ({ match }) => (
  <h3>Invoice #{match.params.id}</h3>
)

class App extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <h2>Invoices</h2>
          <ul>
            <li><Link to="/invoices/1">1</Link></li>
            <li><Link to="/invoices/2">2</Link></li>
            <li><Link to="/invoices/3">3</Link></li>
            <li><Link to="/invoices/4">4</Link></li>
          </ul>

          <h2>Students</h2>
          <ul>
            <li><Link to="/tyler">Tyler</Link></li>
            <li><Link to="/jake">Jake</Link></li>
            <li><Link to="/mikenzi">Mikenzi</Link></li>
          </ul>

          <hr />

          <Route exact path='/:name' component={Student} />
          <Route path='/invoices/:id' component={Invoice} />
        </React.Fragment>
      </Router>
    )
  }
}

export default App