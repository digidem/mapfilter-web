const React = require('react')
const MapFilter = require('react-mapfilter').default
const qs = require('querystring')
const LinearProgress = require('material-ui/LinearProgress').default
const RaisedButton = require('material-ui/RaisedButton').default
const FloatingActionButton = require('material-ui/FloatingActionButton').default
const ContentAdd = require('material-ui/svg-icons/content/add').default

const Authenticator = require('./auth')
const loadGeoJSON = require('./load')
const XFormUploader = require('./xform_uploader')
const Modal = require('./modal')
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
    this.id = qs.parse(window.location.search.replace(/^\?/, '')).id
    this.load = this.load.bind(this)
    this.login = this.login.bind(this)
    this.onProgress = this.onProgress.bind(this)
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this)
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
    loadGeoJSON(this.id, {token: this.state.token}, (err, data) => {
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

  canAddData () {
    const {loading, loadError, authError, token} = this.state
    const isGithub = (this.id || '').split(':')[0] === 'github'
    return isGithub && !loading && !loadError && !authError && token
  }

  handleAddButtonClick () {
    this.setState({showModal: true})
  }

  render () {
    const {features, loading, loadError, progress, showModal} = this.state
    return (
      <div>
        {features ? <MapFilter features={features} addButton={this.canAddData() && AddButton} onAddButtonClick={this.handleAddButtonClick} />
        : loading ? <LinearProgress mode={progress ? 'determinate' : 'indeterminate'} value={progress} />
        : loadError ? this.renderLoginButton()
        : <div>Auth error or missing data</div>}
        {showModal && <Modal component={XFormUploader} />}
      </div>
    )
  }

  renderLoginButton () {
    return <div style={styles.center}>
      <RaisedButton primary onClick={this.login} label='Login with Github' />
    </div>
  }
}

const AddButton = ({onClick}) => (
  <FloatingActionButton backgroundColor='rgb(210, 63, 49)' onTouchTap={onClick}>
    <ContentAdd />
  </FloatingActionButton>
)

module.exports = App
