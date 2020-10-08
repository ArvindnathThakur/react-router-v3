import React from 'react'
import Loading from './Loading'
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

class DynamicImport extends React.Component {
  state = {
    component: null
  }
  componentDidMount() {
    this.props.load()
      .then((component) => {
        this.setState({
          component: component.default
            ? component.default
            : component
        })
      })
  }
  render() {
    return this.props.children(this.state.component)
  }
}

const Home = (props) => (
  <DynamicImport load={() => import('./Home')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Newsletters = (props) => (
  <DynamicImport load={() => import('./Newsletters')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Dashboard = (props) => (
  <DynamicImport load={() => import('../Dashboard')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

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

          <Route exact path='/' component={Home} />
          <Route path='/newsletters' component={Newsletters} />
          <Route path='/dashboard' component={Dashboard} />
        </div>
      </Router>
    )
  }
}

export default App