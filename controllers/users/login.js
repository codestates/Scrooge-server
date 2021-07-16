const {
  generateAccessToken,
  generateRefreshToken,
  sendToken,
} = require("../functions");
const { user } = require("../../models");
const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInfo = await user.findOne({ where: { email } });

    if (!userInfo) {
      return res.status(400).send({ message: "찾을 수 없는 유저입니다." });
    }

    if (password === "scrooge" && email === "scrooge@gmail.com") {
      let accessToken = generateAccessToken(userInfo.dataValues);
      let refreshToken = generateRefreshToken(userInfo.dataValues);

      await user.update(
        { experience: userInfo.dataValues.experience + 1 },
        { where: { id: userInfo.dataValues.id } }
      );

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          sameSite: "none",
          secure: true,
          httpOnly: true,
        })
        .send({
          data: { accessToken, refreshToken },
          message: "Guest 로그인 완료",
        });
    }

    if (String(password).length === 6) {
      if (password !== userInfo.dataValues.password) {
        return res
          .status(409)
          .send({ message: "정확한 정보를 입력해 주십시오." });
      } else {
        delete userInfo.dataValues.password;

        const accessToken = generateAccessToken(userInfo.dataValues);
        const refreshToken = generateRefreshToken(userInfo.dataValues);

        await user.update(
          { experience: userInfo.dataValues.experience + 7 },
          { where: { id: userInfo.dataValues.id } }
        );
        sendToken(res, accessToken, refreshToken);
      }
    } else {
      const hash = crypto
        .createHmac("sha256", process.env.SALT)
        .update(password)
        .digest("hex");
      if (hash !== userInfo.dataValues.password) {
        return res
          .status(409)
          .send({ message: "정확한 정보를 입력해 주십시오." });
      } else {
        delete userInfo.dataValues.password;
        const accessToken = generateAccessToken(userInfo.dataValues);
        const refreshToken = generateRefreshToken(userInfo.dataValues);

        await user.update(
          { experience: userInfo.dataValues.experience + 7 },
          { where: { id: userInfo.dataValues.id } }
        );
        sendToken(res, accessToken, refreshToken);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
