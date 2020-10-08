import React from 'react'
import { 
  BrowserRouter as Router, 
  Redirect, 
  Route 
} from 'react-router-dom'

const submit = () => {
  // fake AF
  return new Promise((res) => {
    setTimeout(() => res(), 500)
  })
}

function Results () {
  return (
    <h1>Mmmm. Thanks for submitting your favorite food.</h1>
  )
}

class Form extends React.Component {
  state = {
    name: '',
    food: '',
    toResults: false
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()

    submit(this.state.name, this.state.food)
      .then(() => {
        this.setState({
          toResults: true
        })
      })
  }
  render() {
    if (this.state.toResults === true) {
      return <Redirect to='/results' />
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Your name
          <input
            type='text'
            value={this.state.name}
            onChange={this.handleChange}
            name='name'
          />
        </label>
        <label>
          Favorite Food
          <input
            type='text'
            value={this.state.food}
            onChange={this.handleChange}
            name='food'
          />
        </label>
        <button type='submit'>Submit</button>
      </form>
    )
  }
}

export default class App extends React.Component {
  render () {
    return (
      <Router>
        <Route exact path='/' component={Form} />
        <Route path='/results' component={Results} />
      </Router>
    )
  }
}
