const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./src/app')
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default
const {addLocaleData, IntlProvider} = require('react-intl')
const enLocaleData = require('react-intl/locale-data/en')

addLocaleData(enLocaleData)

ReactDOM.render(
  <IntlProvider locale={navigator.language}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </IntlProvider>,
  document.getElementById('app')
)
