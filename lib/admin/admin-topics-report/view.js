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

const log = debug('democracyos:admin-topics')

/**
 * Creates a list view of topics
 */

export default class TopicsReportView extends View {
  constructor (topic, forum, tags) {
    super(template, {
      moment,
      urlBuilder
    })
  }

  switchOn () {
    this.bind('click', '.report-raw', this.bound('onrawreportclick'))
    this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date'] })
  }

  onrawreportclick (ev) {
    ev.preventDefault()

    // Download CSV report here
    console.log('DOWNLOADING REPORT!')
  }
}
