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
    // Request
    // // .get(`/api/topic/${this.topic.id}/report?type=status`)
    // .get(`/api/topic/59f78dafe9cb03000464c6f4/report?type=status`)
    // .end((err, res) => {
    //   console.log(res)
    // })

    // Get topic summary by municipal district
    // Request
    // // .get(`/api/topic/${this.topic.id}/report?type=district`)
    // .get(`/api/topic/5abd39af919fec0004127b05/report?type=district`)
    // .end((err, res) => {
    //   console.log(res)
    // })

    // // Get topic summary by last voted date
    Request
    // .get(`/api/topic/${this.topic.id}/report?type=date`)
    .get(`/api/topic/5abd39af919fec0004127b05/report?type=date`)
    .end((err, res) => {
      console.log(res)
    })
  }

  switchOn () {
    this.bind('click', '.report-raw', this.bound('onrawreportclick'))
    // this.list = new List('topics-wrapper', { valueNames: ['topic-title', 'topic-id', 'topic-date'] })
  }

  onrawreportclick (ev) {
    ev.preventDefault()

    // TODO: Make this a download
    Request
      .get(`/api/topic/${this.topic.id}/report?type=raw`)
      // .send({topic: this.topic.id, type: 'raw'})
      .end((err, res) => {

      })
  }
}
