import React, { Component } from 'react'
import { Link } from 'react-router'
import t from 't-component'

export default class Footer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const date = new Date();
    return (
      <footer className='footer'>
        <div className='container center-container'>
        <span>
            © OddVoter, LLC {date.getFullYear()} &nbsp;
            <Link
              to='/terms'>
              {t('help.tos.title')}
            </Link>
            &nbsp; &nbsp;
            <Link
              to='/privacy'>
              {t('help.pp.title')}
            </Link>
          </span>
        </div>
      </footer>
    )
  }
}
