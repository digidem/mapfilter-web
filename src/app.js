const React = require('react')
const MapFilter = require('react-mapfilter').default
const qs = require('querystring')
const LinearProgress = require('material-ui/LinearProgress').default
const RaisedButton = require('material-ui/RaisedButton').default

const Authenticator = require('./auth')
const loadGeoJSON = require('./load')
const storage = window.sessionStorage

const styles = {
  center: {
    alignContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw'
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authError: null,
      loadError: null,
      loading: false,
      token: storage.getItem('githubToken')
    }
    this.load = this.load.bind(this)
    this.login = this.login.bind(this)
    this.onProgress = this.onProgress.bind(this)
    this.auth = new Authenticator({site_id: 'mapfilter.ddem.us'})
  }

  componentWillMount () {
    this.load()
  }

  componentDidUpdate () {
    if (!this.state.token) return storage.removeItem('githubToken')
    storage.setItem('githubToken', this.state.token)
  }

  load () {
    const id = qs.parse(window.location.search.replace(/^\?/, '')).id
    loadGeoJSON(id, {token: this.state.token}, (err, data) => {
      this.setState({loading: false, progress: null})
      if (err) return this.setState({loadError: err, token: null})
      this.setState({features: data.features})
    }).on('progress', this.onProgress)
    this.setState({loading: true, loadError: null})
  }

  onProgress (e) {
    if (!e.lengthComputable) return
    this.setState({
      progress: 100 * e.loaded / e.total
    })
  }

  login () {
    this.auth.authenticate({provider: 'github', scope: 'repo'}, (err, data) => {
      this.setState({loading: false})
      if (err) return this.setState({authError: err})
      this.setState({token: data.token}, () => this.load())
    })
    this.setState({loading: true, authError: null})
  }

  render () {
    const {features, loading, loadError, progress} = this.state
    return features ? <MapFilter features={features} />
      : loading ? <LinearProgress mode={progress ? 'determinate' : 'indeterminate'} value={progress} />
      : loadError ? this.renderLoginButton()
      : <div>Auth error or missing data</div>
  }

  renderLoginButton () {
    return <div style={styles.center}>
      <RaisedButton primary onClick={this.login} label='Login with Github' />
    </div>
  }
}

module.exports = App
