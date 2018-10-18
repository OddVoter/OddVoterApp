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
        console.log(registeredVoterStatusData)
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
        console.log(res.body)
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

        console.log('isVote', isVote)

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

    // // Get topic summary by last voted date
    // if (this.lastVotedDateData === undefined) {
    //   Request
    //   .get(`/api/topic/${this.topic.id}/report?type=date`)
    //   .end((err, res) => {
    //     console.log(res.body)
    //     this.lastVotedDateData = res.body;
    //     console.log('Finished loading last voted date. now re-rending the page')
    //     console.log('this.registeredVoterStatusData', this.registeredVoterStatusData)
    //     console.log('this.votesByMunicipalDistrictData', this.votesByMunicipalDistrictData)
    //     console.log('this.lastVotedDateData', this.lastVotedDateData)
    //     // page(urlBuilder.for('admin.topics.id.report', {
    //     //   id: this.topic.id,
    //     //   forum: this.forum,
    //     //   registeredVoterStatusData: this.registeredVoterStatusData,
    //     //   votesByMunicipalDistrictData: this.votesByMunicipalDistrictData,
    //     //   lastVotedDateData: this.lastVotedDateData
    //     // }))
    //   })
    // }
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