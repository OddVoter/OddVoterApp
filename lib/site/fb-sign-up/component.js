import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config'
import FormAsync from 'lib/site/form-async'
import DatePicker from 'lib/site/components/date-picker'
import GPlacesAutocomplete from 'lib/site/components/places-autocomplete'
import userConnector from 'lib/site/connectors/user'

export class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      active: null,
      errors: null,
      homeAddress: '',
      voterMatchOptIn: false,
      hideMatchMessage: false,
      dateOfBirth: '',
      county: '',
      userId: '',
      userEmail: ''
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.redirectHome = this.redirectHome.bind(this)
    this.saveHomeAddress = this.saveHomeAddress.bind(this)
    this.saveVoterMatch = this.saveVoterMatch.bind(this)
    this.saveDateOfBirth = this.saveDateOfBirth.bind(this)
  }

  componentWillMount () {
    bus.emit('user-form:load', 'signup')
    this.setState({
      active: 'form'
    })
  }

  componentWillUnmount () {
    bus.emit('user-form:load', '')
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.state.fulfilled) {
      const user = this.props.user.state.value
      this.setState({
        userId: user.id,
        userEmail: user.email
      })
    }
  }

  onSubmit () {
    this.setState({ loading: true, errors: null })
  }

  onSuccess (res) {
    this.setState({
      loading: false,
      active: 'congrats',
      errors: null
    })
    this.redirectHome()
  }

  onFail (err) {
    this.setState({ loading: false, errors: err })
  }

  saveHomeAddress (address, county) {
    this.setState({ homeAddress: address, county: county })
  }

  saveVoterMatch (e) {
    this.setState({ voterMatchOptIn: e.target.checked })
  }

  saveDateOfBirth (e) {
    const date = new Date(e)
    this.setState({ dateOfBirth: date })
  }

  redirectHome() {
    this.context.router.push('/')
  }

  render () {
    const placesAutocompleteProps = {
      value: '',
      onChange: this.saveHomeAddress,
    }
    return (
      <div className='center-container'>
        {
          this.state.active === 'form' &&
          (
            <div id='signup-form'>
              <div className='title-page'>
                <div className='circle'>
                  <img src='/lib/boot/logo-mobile.png' alt='OddVoter' className='signup-logo' width='40'/>
                </div>
                <h1>{t('signup.fb.with-email')}</h1>
              </div>
              <FormAsync
                action='/api/fb-signup'
                onSubmit={this.onSubmit}
                onSuccess={this.onSuccess}
                onFail={this.onFail}>
                <input
                  type='hidden'
                  name='reference'
                  value={this.props.location.query.ref} />
                <input
                  type='hidden'
                  name='userId'
                  value={this.state.userId} />
                <input
                  type='hidden'
                  name='email'
                  value={this.state.userEmail} />
                <ul
                  className={this.state.errors ? 'form-errors' : 'hide'}>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => (<li key={key}>{error}</li>))
                  }
                </ul>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-date-of-birth')}</label>
                  <DatePicker
                    dateChange={this.saveDateOfBirth} />
                  <input
                    type='hidden'
                    name='dateOfBirth'
                    value={this.state.dateOfBirth} />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-home-address')}</label>
                  <GPlacesAutocomplete
                    inputProps={placesAutocompleteProps}
                    name='homeAddress'
                    placeholder={t('signup.home-address')}
                    onSelect={this.saveHomeAddress} />
                  <input
                    type='hidden'
                    name='county'
                    value={this.state.county} />
                </div>
                <div id='checkbox-container' className='form-group'>
                  <input
                    type='checkbox'
                    id='matchVoter'
                    onChange={this.saveVoterMatch}
                    name='voterMatchOptIn'
                    value={this.state.voterMatchOptIn} />
                  <label id='match-voter-label' htmlFor=''>{t('signup.verify-registered-voter')}</label>
                  <p id='match-voter-description' htmlFor=''>{t('signup.verify-registered-voter-detail')}</p>
                </div>
                <div className='form-group'>
                  <button
                    className={!this.state.loading ? 'btn btn-block btn-success btn-lg' : 'hide'}
                    type='submit'>
                    {t('signup.now')}
                  </button>
                  <button
                    className={this.state.loading ? 'loader-btn btn btn-block btn-default btn-lg' : 'hide'}>
                    <div className='loader' />
                    {t('signup.now')}
                  </button>
                </div>
                {
                    (!!config.termsOfService || !!config.privacyPolicy) &&
                    (
                      <div className='form-group accepting'>
                        <p className='help-block text-center'>
                          {t('signup.accepting')}
                        </p>
                        {
                          !!config.termsOfService &&
                          (
                            <Link
                              to='/help/terms-of-service'>
                              {t('help.tos.title')}
                            </Link>
                          )
                        }
                        {
                          !!config.privacyPolicy &&
                          (
                            <Link
                              to='/help/privacy-policy'>
                              {t('help.pp.title')}
                            </Link>
                          )
                        }
                      </div>
                    )
                  }
              </FormAsync>
            </div>
          )
        }
      </div>
    )
  }
}

SignUp.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default userConnector(SignUp)
