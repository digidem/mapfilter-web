const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./src/app')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default

ReactDOM.render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('app'))
