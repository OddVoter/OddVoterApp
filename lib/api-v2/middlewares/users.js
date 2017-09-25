exports.restrict = function restrict (req, res, next) {

  if ((req.headers.accept || '').indexOf('text/html') > -1) {
    var url = req.url;
    url = url.replace('/vote', '');
    url = url.replace('topics', 'topic');

    if (req.user) {
      return next();
    }
    else {
      return res.redirect('/signin?ref=' + url);
    }
  }

  if (req.user) return next()

  const err = new Error('User is not logged in.')
  err.status = 403
  err.code = 'NOT_LOGGED_IN'

  return next(err)
}
