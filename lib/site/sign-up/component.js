import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import t from 't-component'
import Select from 'react-select'
import config from 'lib/config'
import FormAsync from 'lib/site/form-async'
import DatePicker from 'lib/site/components/date-picker'
import GPlacesAutocomplete from 'lib/site/components/places-autocomplete'

export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      active: null,
      errors: null,
      name: '',
      lastName: '',
      email: '',
      pass: '',
      homeAddress: '',
      voterMatchOptIn: false,
      hideMatchMessage: false,
      dateOfBirth: '',
      county: ''
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.saveName = this.saveName.bind(this)
    this.saveLastName = this.saveLastName.bind(this)
    this.saveEmail = this.saveEmail.bind(this)
    this.savePass = this.savePass.bind(this)
    this.checkPassLength = this.checkPassLength.bind(this)
    this.saveHomeAddress = this.saveHomeAddress.bind(this)
    this.saveVoterMatch = this.saveVoterMatch.bind(this)
    this.saveDateOfBirth = this.saveDateOfBirth.bind(this)
    this.countyChange = this.countyChange.bind(this)
  }

  componentWillMount () {
    bus.emit('user-form:load', 'signup')
    this.setState({ active: 'form' })
  }

  componentWillUnmount () {
    bus.emit('user-form:load', '')
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
  }

  onFail (err) {
    this.setState({ loading: false, errors: err })
  }

  saveName (e) {
    this.setState({ name: e.target.value })
  }

  saveLastName (e) {
    this.setState({ lastName: e.target.value })
  }

  saveEmail (e) {
    this.setState({ email: e.target.value })
  }

  savePass (e) {
    this.setState({ pass: e.target.value })
  }

  saveHomeAddress (address, county) {
    if (county !== 'DeKalb County' && county !== 'Fulton County') {
      county = 'Other'
    }
    this.setState({ homeAddress: address, county: county })
  }

  saveVoterMatch (e) {
    this.setState({ voterMatchOptIn: e.target.checked })
  }

  saveDateOfBirth (e) {
    const date = new Date(e)
    this.setState({ dateOfBirth: date })
  }

  countyChange (selectedOption) {
    this.setState({ county: selectedOption.value || 'Other' })
  }
  
  checkPassLength (e) {
    const passLength = e.target.value

    if (passLength.length < 6) {
      e.target.setCustomValidity(t('validators.min-length.plural', { n: 6 }))
    } else {
      if (e.target.name === 're_password' && e.target.value !== this.state.pass) {
        e.target.setCustomValidity(t('common.pass-match-error'))
      } else {
        e.target.setCustomValidity('')
      }
    }
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
                <h1>{t('signup.with-email')}</h1>
              </div>
              <FormAsync
                action='/api/signup'
                onSubmit={this.onSubmit}
                onSuccess={this.onSuccess}
                onFail={this.onFail}>
                <input
                  type='hidden'
                  name='reference'
                  value={this.props.location.query.ref} />
                <ul
                  className={this.state.errors ? 'form-errors' : 'hide'}>
                  {
                    this.state.errors && this.state.errors
                      .map((error, key) => (<li key={key}>{error}</li>))
                  }
                </ul>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.email')}</label>
                  <input
                    type='email'
                    className='form-control'
                    name='email'
                    maxLength='200'
                    onChange={this.saveEmail}
                    placeholder={t('forgot.mail.example')}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-firstname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='firstName'
                    name='firstName'
                    maxLength='100'
                    placeholder={t('signup.firstname')}
                    onChange={this.saveName}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-lastname')}</label>
                  <input
                    type='text'
                    className='form-control'
                    id='lastName'
                    name='lastName'
                    maxLength='100'
                    onChange={this.saveLastName}
                    placeholder={t('signup.lastname')}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('password')}</label>
                  <input
                    id='signup-pass'
                    className='form-control'
                    name='password'
                    type='password'
                    maxLength='200'
                    onChange={this.savePass}
                    onBlur={this.checkPassLength}
                    placeholder={t('password')}
                    required />
                </div>
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.retype-password')}</label>
                  <input
                    type='password'
                    className='form-control'
                    name='re_password'
                    onBlur={this.checkPassLength}
                    required />
                </div>
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
                    required={true}
                    onSelect={this.saveHomeAddress} />
                  <input
                    type='hidden'
                    name='county'
                    value={this.state.county} />
                </div>
                
                <div className='form-group'>
                  <label htmlFor=''>{t('signup.your-county')}</label>
                  <Select
                    name='county'
                    className='form-control'
                    required={true}
                    placeholder='Select your county'
                    value={this.state.county}
                    onChange={this.countyChange}
                    options={[
                      { value: 'Fulton County', label: 'Fulton' },
                      { value: 'DeKalb County', label: 'DeKalb' },
                      { value: 'Other', label: 'Other' }
                    ]} />
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
                  <input
                    type='hidden'
                    name='hideMatchMessage'
                    value={this.state.hideMatchMessage} />
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
                              to='/terms'>
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
              </FormAsync>
            </div>
          )
        }
        {
          this.state.active === 'congrats' &&
          (
            <div id='signup-message'>
              <h1>{t('signup.welcome', { name: this.state.name + ' ' + this.state.lastName })}</h1>
              <p className='lead'>{t('signup.received')}</p>
              <p className='lead'>{t('signup.check-email')}</p>
              <Link
                to='/signup/resend-validation-email'>
                {t('signup.resend-validation-email')}
              </Link>
            </div>
          )
        }
      </div>
    )
  }
}
