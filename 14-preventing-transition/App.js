import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Prompt
} from 'react-router-dom'

const Home = () => <h1>Home</h1>
const Settings = () => <h1>Settings</h1>

class Survey extends React.Component {
  state = {
    isBlocking: false,
    food: ''
  }
  handleSubmit = (e) => {
    e.preventDefault()
    e.target.reset()
    this.setState({
      isBlocking: false
    })
  }
  handleChange = (e) => {
    const food = e.target.value
    
    this.setState({
      isBlocking: food.length > 0,
      food,
    })
  }
  render() {
    const { food, isBlocking } = this.state

    if (food && !isBlocking) {
      return <h1>Thank you for your submission</h1>
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <Prompt
          when={isBlocking}
          message={(location) => `Are you sure you want to go to ${location.pathname}`}
        />

        <label>
          What is your favorite food?

          <input 
            type='text'
            placeholder='Favorite Food'
            onChange={this.handleChange}
            value={food}
          />
        </label>
        <button type='submit'>Submit</button>
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/survey">Survey</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>

          <hr />

          <Route path="/" exact component={Home} />
          <Route path="/survey" component={Survey} />
          <Route path="/settings" component={Settings} />
        </div>
      </Router>
    )
  }
}

export default App