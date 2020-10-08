import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Friends = ({ location }) => (
  <React.Fragment>
    <h1>Friends</h1>
    <ul>
      {location.state.friends.map(({ name, handle, avatar }) => (
        <li key={name} className='user'>
          <img
            alt={`Avatar for ${name}`}
            src={avatar}
          />
          <a href={`https://twitter.com/${handle}`}>{name}</a>
      </li>
      ))}
    </ul>
  </React.Fragment>
)

const Home = () => <h1>Home</h1>

export default class App extends React.Component {
  state = {
    friends: [
      {
        name: 'Tyler McGinnis',
        handle: 'tylermcginnis',
        avatar: 'https://res.cloudinary.com/uidotdev/image/twitter_name/tylermcginnis'
      },
      {
        name: 'Sarah Drasner',
        handle: 'sarah_edo',
        avatar: 'https://res.cloudinary.com/uidotdev/image/twitter_name/sarah_edo'
      },
      {
        name: 'Dan Abramov',
        handle: 'dan_abramov',
        avatar: 'https://res.cloudinary.com/uidotdev/image/twitter_name/dan_abramov'
      }
    ]
  }
  render() {
    const { friends } = this.state

    return (
      <Router>
        <div>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li>
              <Link to={{ 
                pathname: '/friends', 
                state: { friends }
              }}>Friends</Link>
            </li>
          </ul>

          <hr />

          <Route exact path='/' component={Home} />
          <Route path='/friends' component={Friends} />
        </div>
      </Router>
    )
  }
}