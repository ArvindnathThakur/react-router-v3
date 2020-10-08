import React from 'react'
import Loading from './Loading'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

const Home = React.lazy(() => import('./Home'))
const Newsletters = React.lazy(() => import('./Newsletters'))
const Dashboard = React.lazy(() => import('./Dashboard'))

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/newsletters'>Newsletters</Link></li>
            <li><Link to='/dashboard'>Dashboard</Link></li>
          </ul>

          <hr />

          <React.Suspense fallback={<Loading />}>
            <Route exact path='/' component={Home} />
            <Route path='/newsletters' component={Newsletters} />
            <Route path='/dashboard' component={Dashboard} />
          </React.Suspense>
        </div>
      </Router>
    )
  }
}

export default App