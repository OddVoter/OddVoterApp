/**
 * Module dependencies.
 */

import debug from 'debug'
import t from 't-component'
import template from './template.jade'
import topicStore from '../../stores/topic-store/topic-store'
import List from 'democracyos-list.js'
import moment from 'moment'
import confirm from 'democracyos-confirmation'
import View from '../../view/view'
import urlBuilder from 'lib/url-builder'
import Request from 'lib/request/request'

const log = debug('democracyos:admin-topics')

/**
 * Creates a list view of topics
 */

export default class TopicsReportView extends View {
  constructor (topic) {
    const locals = {
      topic: topic,
      moment: moment,
      urlBuilder
    }

    super(template, locals)

    this.topic = topic
  }

  switchOn () {
    this.bind('click', '.report-raw', this.bound('onrawreportclick'))
    // this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date'] })
  }

  onrawreportclick (ev) {
    ev.preventDefault()

    // Request
    //   .post('/api/signup/validate')
    //   .send({token: this.props.params.token})
    //   .end((err, res) => {
    //     if (err || res.body.error) {
    //       this.setState({active: 'form', errors: [t('common.internal-error')]})
    //       return
    //     }
    //     this.setState({active: 'welcome'})
    //     this.props.user.update(res.body)
    //   })

    // Download CSV report here
    console.log('DOWNLOADING REPORT: ' + this.topic.id)
  }
}
