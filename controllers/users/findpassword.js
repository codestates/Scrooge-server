const { user } = require("../../models");
const nodemailer = require("nodemailer");
    
module.exports = async (req, res) => {
    const { email } = req.body

    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_SECRET
        },
    });
    let randomPassword = Math.floor(Math.random() * 1000000)
    await user.update({ password: randomPassword }, { where: { email }})
    
    await transporter.sendMail({
        from: `"Scrooge Team" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: "Scrooge Team",
        text: `임시비밀번호: ${randomPassword}
로그인 후 비밀번호를 변경해주세요.`,
    });
    return res.status(200).send({ message: "임시비밀번호가 전송되었습니다" });
}