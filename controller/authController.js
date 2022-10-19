const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PW,
    },
});


exports.getSignup = async (req, res) => {
    res.render("signup")
}

exports.getLogin = async (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error')
    res.render("login", { success, error });
}



exports.getForgetPassword = async (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error');
    res.render("forget-password", { success, error })
}

exports.resetPassword = async (req, res) => {
    const token = req.query.token
    res.render("reset-password", { token })
}


exports.signUp = async (req, res) => {
    try {
        const otp = Math.floor(Math.random() * 899999 + 100000)
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            otp
        })

        await user.save()

        let info = await transporter.sendMail({
            from: 'Deepak <deepakkumarn086747@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "User Verification", // Subject line
            html: `<p> ${otp} </p>`,
        });

        console.log(info);

        const token = jwt.sign({ email: req.body.email }, process.env.SECRETE_KEY)
        req.flash("success", "Mail Suucessfully Sent")
        return res.status(200).redirect(`/verify-otp?token=${token}`)

    } catch (error) {
        return res.status(401).redirect('/signup')
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "Please sign up first ")
            return res.redirect('/signup');
        }

        if (!user.verified) {
            req.flash("error", "Please verified your account ")

            const token = jwt.sign({ email }, process.env.SECRETE_KEY)

            return res.redirect(`/verify-otp?token=${token}`);
        }

        const matchPw = await bcrypt.compare(password, user.password);
        if (!matchPw) {
            return res.status(401).redirect('/login');
        }

        req.session.user = user.email

        return res.status(200).redirect('/dashboard')

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login')
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect('/signup')
        }

        const token = jwt.sign({
            email: user.email
            // _id: user._id
        }, process.env.SECRETE_KEY, { expiresIn: '10m' });


        let info = await transporter.sendMail({
            from: 'Deepak <deepakkumarn086747@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Password reset", // Subject line
            html: `<a href="http://localhost:3000/reset-password?token=${token}"> Click here to reset your password </a>`,
        });
        console.log(info);
        req.flash("success", "Mail Suucessfully Sent")
        return res.status(200).redirect('/forget-password')

        // return res.status(200).json({
        //     success: true,
        //     data: info,
        //     token: token,
        //     message: "forgot password send to your mail"
        // })
    } catch (error) {
        return res.status(401).redirect('/forget-password')
    }
}


exports.resetPw = async (req, res) => {
    const newPassword = req.body.new_password;
    const confirmPass = req.body.confirm_password;
    const token = req.body.token

    if (newPassword !== confirmPass) {
        return res.status(401).redirect('/reset-password')
    }

    const decodeToken = jwt.verify(token, process.env.SECRETE_KEY);

    const email = decodeToken.email;
    const user = await User.findOne({ email });


    user.password = confirmPass;
    const updateUser = await user.save()
    return res.redirect('/login')



}

exports.verifyOtp = (req, res) => {

    try {
        const token = req.query.token
        if (!token) {
            return res.redirect('/login')
        }
        return res.render('otpVerify', { token })
    } catch (error) {

    }
}


exports.signupOtpVerification = async (req, res) => {
    try {
        const { token } = req.body;

        const otp = req.body.otp;

        const decodeToken = jwt.verify(token, process.env.SECRETE_KEY)

        const { email } = decodeToken;

        const user = await User.findOne({ email })


        if (!user) {
            req.flash('error', 'you are not registered pls signup !')
            return res.redirect('/signup')
        }

        if (otp !== user.otp) {
            req.flash('error', 'otp invalid!')
            return res.redirect(`/verify-otp?token=${token}`)
        }

        user.verified = true
        await user.save(); 

        return res.redirect('/login');

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}