import React from "react";
import "./styles.css";
import { parse } from 'query-string'
import { 
  BrowserRouter as Router,
  Link,
  Route
} from 'react-router-dom'

const users = {
  tylermcginnis: {
    name: 'Tyler McGinnis',
    handle: 'tylermcginnis',
    avatar: 'https://res.cloudinary.com/uidotdev/image/twitter_name/tylermcginnis'
  },
  sarah_edo: {
    name: 'Sarah Drasner',
    handle: 'sarah_edo',
    avatar: 'https://res.cloudinary.com/uidotdev/image/twitter_name/sarah_edo'
  },
  dan_abramov: {
    name: 'Dan Abramov',
    handle: 'dan_abramov',
    avatar: 'https://res.cloudinary.com/uidotdev/image/twitter_name/dan_abramov'
  }
}

function User ({ location }) {
  const { id } = parse(location.search)

  if (!id) {
    return <p>Select a user</p>
  }

  const { name, handle, avatar } = users[id] 

  return (
    <div className='user'>
      <img
        alt={`Avatar for ${name}`}
        src={avatar} 
      />
      <a href={`https://twitter.com/${handle}`}>{name}</a>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <div>
        <h1>Users</h1>
        <ul>
          <li><Link to='/?id=tylermcginnis'>Tyler</Link></li>
          <li><Link to='/?id=sarah_edo'>Sarah</Link></li>
          <li><Link to='/?id=dan_abramov'>Dan</Link></li>
        </ul>

        <hr />

        <Route path='/' component={User} />
      </div>
    </Router>
  );
}
