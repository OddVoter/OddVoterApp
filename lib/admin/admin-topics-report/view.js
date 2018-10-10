/**
 * Module dependencies.
 */

import debug from 'debug'
import template from './template.jade'
import moment from 'moment'
import View from '../../view/view'
import urlBuilder from 'lib/url-builder'
import Request from 'lib/request/request'

export default class TopicsReportView extends View {
  constructor (topic, forum) {
    const locals = {
      topic: topic,
      forum: forum,
      moment: moment,
      urlBuilder
    }

    super(template, locals)

    this.topic = topic
    this.forum = forum

    // 59f78dafe9cb03000464c6f4 POLL
    // 5abd39af919fec0004127b05 VOTE

    // Get topic summary by registered voter status
    Request
    .get(`/api/topic/${this.topic.id}/report?type=status`)
    .end((err, res) => {
      console.log("By status")
      console.log(res)
    })

    // Get topic summary by municipal district
    Request
    .get(`/api/topic/${this.topic.id}/report?type=district`)
    .end((err, res) => {
      console.log("By District")
      console.log(res)
    })

    // Get topic summary by last voted date
    Request
    .get(`/api/topic/${this.topic.id}/report?type=date`)
    .end((err, res) => {
      console.log("By Date")
      console.log(res)
    })
  }

  switchOn () {
    this.bind('click', '.report-raw', this.bound('onrawreportclick'))
  }

  onrawreportclick (ev) {
    ev.preventDefault()

    Request
      .get(`/api/topic/${this.topic.id}/report?type=raw`)
      .end((err, res) => {
        console.log('Raw Report')
        console.log(res)
      })
  }
}