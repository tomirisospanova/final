const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_flash', 'You must be logged In.')
    return res.redirect('/login')
}

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
}
const checkRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        next();
    } else {
        res.status(403).send('Unauthorized');
    }
};


module.exports = {
    isAuth,
    isLoggedIn,
    checkRole
}