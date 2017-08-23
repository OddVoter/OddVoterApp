import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import t from 't-component'
import Request from 'lib/request/request'
import urlBuilder from 'lib/url-builder'
import config from 'lib/config'
import checkReservedNames from 'lib/forum/check-reserved-names'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import TopicCard from './topic-card/component'

export class HomeForum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: null,
      topics: [],
      forum: null
    }
  }

  componentWillMount () {
    if (!config.multiForum && !config.defaultForum) {
      window.location = urlBuilder.for('forums.new')
    }

    let name = this.props.params.forum

    if (!name && !config.multiForum) {
      name = config.defaultForum
    }

    checkReservedNames(name)

    this.setState({ loading: true })

    var u = new window.URLSearchParams(window.location.search)
    let query = {}

    forumStore.findOneByName(name)
      .then((forum) => {
        query.forum = forum.id
        if (u.has('tag')) query.tag = u.get('tag')
        return Promise.all([
          forum,
          topicStore.findAll(query)
        ])
      })
      .then(([forum, topics]) => {
        this.setState({
          loading: false,
          forum,
          topics
        })
      })
      .catch((err) => {
        if (err.status === 404) return browserHistory.push('/404')
        if (err.status === 401) return browserHistory.push('/401')
        throw err
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.state.fulfilled) {
      const user = this.props.user.state.value
      this.setState({
        user: user
      })
      Request
      .post('/api/voter-match')
      .send({
        firstName: user.firstName,
        lastName: user.lastName,
        county: user.county,
        dateOfBirth: user.dateOfBirth
      })
      .end((err, res) => {
        if (err) {
          this.setState({
            voterMatched: false
          })
          return
        }
        this.setState({
          voterMatched: true
        })
      })
    }
  }

  render () {
    if (config.visibility === 'hidden' && this.props.user.state.rejected) {
      browserHistory.push('/signin')
      return null
    }

    if (!this.state.forum) return null

    const { forum, topics } = this.state

    const cover = (forum.coverUrl && {
      backgroundImage: 'linear-gradient(rgba(0,0,0, 0.6), rgba(0,0,0, 0.6)), url("' + forum.coverUrl + '")'
    }) || null

    return (
      <div id='forum-home'>
        <div
          className={'cover' + (forum.coverUrl ? '' : ' no-img')}
          style={cover}>
          <div className='cover-content'>
            <h1>{forum.title}</h1>
            <p>{forum.summary}</p>
            {
              forum.privileges.canCreateTopics &&
                <a
                  href={urlBuilder.for('admin.topics.create', {
                    forum: forum.name
                  })}
                  className='btn btn-primary'>
                  {t('proposal-article.create')}
                </a>
            }
            <div className='no-registration-message'>
              {this.renderVoterMatchResult()}
            </div>
          </div>
        </div>
        {topics.length === 0 && (
          <div className='no-topics'>
            <p>{t('homepage.no-topics')}</p>
          </div>
        )}
        <div className='topics-container'>
          {this.state.loading && (
            <div className='loader-wrapper'>
              <div className='topic-loader' />
            </div>
          )}
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    )
  }

  renderVoterMatchResult() {
    if (!this.state.voterMatched) {
      return (
        <p>We didn&apos;t find your matching voter record, if you think this is an error, please email us at <a href='mailto:help@oddvoter.com'>help@oddvoter.com</a>.
          If you&apos;re not registered to vote, visit <a target='_blank' href='http://www.rockthevote.com'>Rock the Vote</a> to register.</p>
      )
    }
  }
}

export default userConnector(HomeForum)
