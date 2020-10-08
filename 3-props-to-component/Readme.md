React Router v4 uses a declarative, component-based approach to routing. What that means is when you want to create a new route, you render a Route component. Route allows you to map URL paths to different React components. For example, say we wanted to render the Dashboard component whenever a user navigates to the /dashboard path. To do that, we’d render a Route that looks like this.

<Route path='/dashboard' component={Dashboard} />
Now, what if we also wanted to pass the Dashboard component a prop? There are a few different ways to solve this problem but only one right way. The first idea you might have is to just pass it as a prop on Route.

<Route
  path='/dashboard'
  component={Dashboard}
  isAuthed={true}
/>
Unfortunately, this won’t work. React Router won’t forward that prop onto the component. Instead, it will just ignore it.

The next idea you might have, and a pattern I’ve seen a few places is to pass component an inline function that creates the React element.

<Route
  path='/dashboard'
  component={() => <Dashboard isAuthed={true} />}
/>
Though technically this will work, it’s not the best solution. The reason for this is because of performance. According to the official React Router v4 docs…

“When you use component, the router uses React.createElement to create a new React element from the given component. That means if you provide an inline function to the component attribute, you would create a new component every render. This results in the existing component unmounting and the new component mounting instead of just updating the existing component.”

So if you’re not supposed to pass a function to component, what’s the solution? Instead of using the component prop, use the render prop.

render accepts a functional component and that function won’t get unnecessarily remounted like with component. That function will also receive all the same props that component would receive so you can pass those through to the rendered component.

<Route
  path='/dashboard'
  render={(props) => (
    <Dashboard {...props} isAuthed={true} />
  )}
/>
So to recap, if you need to pass a prop to a component being rendered by React Router v4, instead of using Routes component prop, use its render prop. With render, you’re in charge of creating the element and can pass the component any props you’d like.