You’ve been working hard on a React app that uses React Router (or Reach Router). Things are progressing nicely. You’re ahead of your deadline and you might just leave work early to enjoy those extra few hours of the weekend. You decide to do one last pass-through of your app before taking off. “That button should have a little more border-radius to it.” you think. You change it, hit refresh, your app breaks. It’s not your typical error. If it were, you wouldn’t have sworn under your breath. Cannot read property 'state' of undefined, no worries. You’ve seen that one plenty of times. This one was different. It wasn’t even that the app crashed, it’s deeper than that. You stare at your monitor through your fingers. That’s it. That’s all you get. Your whole app breaks on refresh and all you get is three words.

Cannot GET /dashboard

“Probably a hot module replacement issue. Just an anomaly” - you optimistically convince yourself. To validate your assumption you restart the app. “Home page looks good. Navigating works fine. Let’s try to refresh again.”

Cannot GET /settings

Defeat. No other words describe it so perfectly. There goes your long weekend. There might even go your whole weekend since you have literally no idea what’s going on. Luckily for you, you found this post. Meta, right?

First, let’s establish the problem you’re having. To do that, we’ll need to talk about how the browser and client-side routers work.

In the old days, things were simple. If you wanted to get the contents of /dashboard, the browser would make a GET request to your server, by inspecting the path portion of the URL the server would figure out that the user was requesting the /dashboard page. It would then grab that page and send it back to the browser as a response.

Then these things called client-side routers (CSR) came into the picture. With a CSR (like React Router), you’re no longer making requests to your server every time you change routes. Instead, your CSR is just handling that for you locally on the browser. So when you go to /dashboard, instead of making a GET request to your server, your CSR is using a browser API called history.pushState to manually change the URL and render the View for that specific route - all without causing a page refresh.

Let’s look at that process a little more in depth.

The first time a user loads your app (i.e., visits your website), they don’t have any JavaScript loaded. That means no React and no React Router - so the first request will always be to your server. Then, assuming there was a successful GET request, all your JavaScript loads and React Router confidently hijacks your routing. From here on out, any other route changes in your app will be handled by React Router.

Notice the issue yet? React Router can only load after the first successful GET request to your server (or /). The reason for the dreaded Cannot GET /* error is because, if you’re at /dashboard and then hit refresh, the browser will make a GET request to /dashboard which will fail since you have no logic on your server for handling that request (since React Router is supposed to do it).

In case the issue is still fuzzy, here’s another example. Say you are really proud of the app you’ve been working on and you want to share it with your Mom. The app is Tic Tac Toe and has three routes, /, /play, and leaderboard. You send your Mom the link https://tictactyler.com/play since you want to play with her. When she enters that URL into her browser and hits enter, what happens? At this point, she has no JavaScript, no React, and no React Router. The browser makes a GET request to /play and, since you’re relying on React Router to handle all the routing logic (but she has no React Router yet), the app crashes and she gets Cannot GET /play.

“Alright, alright, alright.” - Matthew Mcconaughey

Now the big question, how do we fix this?

The root of the issue is that you’re relying entirely on client side routing without setting up any logic to handle server-side routing. There are two main ideas for solving this problem. The first, set up both client and server side routing. The second, redirect all server requests to /index.html which will download all the JS resources and allow React Router to take it from there. Most of the solutions we’ll look at involve the latter as it’s more simple.

Hash History
TBH, this one is kind of a hack. Have you ever seen those URLs with # in them? They’re using Hash History. The idea is by appending a # to the end of the root of your URL, anything after that # won’t be sent to the server. So if the URL was https://ui.dev/#/courses, the browser would make a GET request to https://ui.dev, get back all the JavaScript, React Router would then load, see /courses, and show the proper view for that route. React Router provides a HashRouter component you could use that will get you hash-based routing, but honestly, unless you REALLY need it, there are better options.

Catch-all
If you already have a server you’re using, this is probably your best bet. The main idea here is that you redirect all of your server requests to /index.html. The outcome is similar to Hash History. Any request that is made to your server will respond with the index page (and then fetch any JS resources you need), React Router will then take over and load the appropriate view. The actual code for this varies on which type of server you have.

Express
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'path/to/your/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})
Apache .htaccess
RewriteBase /
RewriteRule ^index\.html$ - [L]
 RewriteCond %{REQUEST_FILENAME} !-f
 RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
Nginx .conf
location / {
  if (!-e $request_filename){
    rewrite ^(.*)$ /index.html break;
  }
}
No Server
For those blessed developers who don’t have to worry about managing a server, there are options for you as well and they (typically) come baked into the hosting service you’re using. There are obviously a lot of different variations here but you need to find a service that supports client-side routers.

For example, if you host with Firebase, one of the questions it asks you is

Configure as a single-page app (rewrite all urls to /index.html)?

Netlify also supports client-side routing, you just need to create a /_redirects file with the following rule

/*  /index.html  200
As you can probably guess, that tells Netlify to redirect all requests to .index.html.

Webpack / Development
This section is for everyone who ran into this problem in development using webpack-dev-server.. Just as above, what we need to do it tell Webpack Dev Server to redirect all server requests to /index.html. There are just two properties in your webpack config you need to set to do this, publicPath and historyApiFallback.

publicPath: '/',
historyApiFallback: true,
publicPath allows you to specify the base path for all the assets within your application. historyAPIFallback will redirect 404s to /index.html.

Here’s an example of a basic webpack config file with both options in case you need it.

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ]
};