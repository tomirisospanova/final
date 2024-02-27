const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getLoginPage,
  getRegisterPage,
  registerUser,
  loginUser,
  logoutUser,
  googleSignin,
  googleSigninCallback,
  getForgotPasswordPage,
  postForgotPasswordPage,
  getPasswordResetPage,
  resetPassword,
  
} = require("../controllers/usersAuth");
const { renderAdminPage, 
    addUser,
    getUserById,
    deleteUser,
    updateUser, } = require('../controllers/adminController');

const { isLoggedIn, checkRole } = require("../middleware/authUser"); 

router.route("/login").get(isLoggedIn, getLoginPage).post(loginUser(passport));
router.route("/register").get(isLoggedIn, getRegisterPage).post(registerUser);
router.route("/logout").delete(logoutUser);
router.route('/auth/google').get(googleSignin(passport))
router.route("/auth/google/callback").get(googleSigninCallback(passport));
router.route('/forgot-password').get(isLoggedIn, getForgotPasswordPage).post(postForgotPasswordPage)
router.route("/reset/:token").get(isLoggedIn, getPasswordResetPage).post(resetPassword)
router.route('/admin')
  .get(renderAdminPage)
  .post(addUser);
router.get('/admin/user/:id', getUserById);
router.post('/admin/user-delete/:id', deleteUser);
router.post('/admin/user/:id', updateUser);



module.exports = router;
