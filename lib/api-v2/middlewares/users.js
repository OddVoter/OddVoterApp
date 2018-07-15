const debug = require('debug')
const log = debug('democracyos:api:topic')

exports.restrict = function restrict (req, res, next) {
  if ((req.headers.accept || '').indexOf('text/html') > -1) {
    var url = req.url

    if (req.user) {
      url = url.replace('/vote', '')
      url = url.replace('topics', 'topic')
      return next()
    }
    else {
      url = url.replace('/topics', '/api/v2/topics')
      return res.redirect('/signin?ref=' + url)
    }
  }

  if (req.user) return next()

  const err = new Error('User is not logged in.')
  err.status = 403
  err.code = 'NOT_LOGGED_IN'

  return next(err)
}
