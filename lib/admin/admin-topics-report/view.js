/**
 * Module dependencies.
 */

import React, { Component } from 'react'
import { render as ReactRender } from 'react-dom'
import debug from 'debug'
import t from 't-component'
import page from 'page'
import o from 'component-dom'
import { dom as render } from 'lib/render/render'
import template from './template.jade'
import moment from 'moment'
import View from '../../view/view'
import urlBuilder from 'lib/url-builder'
import Request from 'lib/request/request'
import registeredVoterStatusTemplate from './registeredVoterStatus.jade'
import votesByMunicipalDistrictTemplate from './votesByMunicipalDistrict.jade'
import lastVotedDateTemplate from './lastVotedDate.jade'

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
    if (this.registeredVoterStatusData === undefined) {
      Request
      .get(`/api/topic/${this.topic.id}/report?type=status`)
      .end((err, res) => {
        const registeredVoterStatusData = res.body
        const topicsContainer = o('.topics-reports-container', this.el)
        const registeredVoterData = render(registeredVoterStatusTemplate, {
          registeredVoterStatusData: registeredVoterStatusData
        })
        topicsContainer.append(o(registeredVoterData))
      })
    }

    // Get topic summary by municipal district
    if (this.votesByMunicipalDistrictData === undefined) {
      Request
      .get(`/api/topic/${this.topic.id}/report?type=district`)
      .end((err, res) => {
        const votesByMunicipalDistrictData = res.body
        const districts = []
        let votesByMunicipalDistrictGrandTotal = 0
        const isVote = (votesByMunicipalDistrictData[0]).yes !== undefined || false

        if (isVote) {
          for (const data of votesByMunicipalDistrictData) {
            votesByMunicipalDistrictGrandTotal += data['no'] + data['yes'] + data['neutral']
            districts.push({ name: 'District ' + data['district'], grandTotal: data['no'] + data['yes'] + data['neutral'] })
          }
        } else {
          for (const data of votesByMunicipalDistrictData) {
            for (var key in data) {
              if (key !== 'item') {
                districts.push({ name: 'District ' + key })
              }
            }
            break
          }
        }

        const topicsContainer = o('.topics-reports-container', this.el)
        const votesByMunicipalDistrict = render(votesByMunicipalDistrictTemplate, {
          districts: districts,
          votesByMunicipalDistrictGrandTotal: votesByMunicipalDistrictGrandTotal,
          votesByMunicipalDistrictData: votesByMunicipalDistrictData,
          isVote: isVote
        })
        topicsContainer.append(o(votesByMunicipalDistrict))
      })
    }

    // Get topic summary by last voted date
    if (this.lastVotedDateData === undefined) {
      Request
      .get(`/api/topic/${this.topic.id}/report?type=date`)
      .end((err, res) => {
        const lastVotedDateData = res.body
        const lastVotedDates = []

        let lastVotedDateGrandTotal = 0
        const isVote = (lastVotedDateData[0]).yes !== undefined || false

        if (isVote) {
          for (const data of lastVotedDateData) {
            lastVotedDateGrandTotal += data['no'] + data['yes'] + data['neutral']
            lastVotedDates.push({ name: 'Last Voted Date ' + data['district'], grandTotal: data['no'] + data['yes'] + data['neutral'] })
          }
        } else {
          for (const data of lastVotedDateData) {
            for (var key in data) {
              if (key !== 'item') {
                lastVotedDates.push({ name: key })
              }
            }
            break
          }
        }
        const topicsContainer = o('.topics-reports-container', this.el)
        const votesByLastVotedDate = render(lastVotedDateTemplate, {
          lastVotedDates: lastVotedDates,
          lastVotedDateData: lastVotedDateData,
          lastVotedDateGrandTotal: lastVotedDateGrandTotal,
          isVote: isVote
        })
        topicsContainer.append(o(votesByLastVotedDate))
      })
    }
  }

  switchOn () {
    this.bind('click', '.report-raw', this.bound('onrawreportclick'))
  }

  onrawreportclick (ev) {
    ev.preventDefault()

    // TODO: Make this a download
    Request
      .get(`/api/topic/${this.topic.id}/report?type=raw`)
      .end((err, res) => {

      })
  }
}