const { user } = require("../../models");
const axios = require("axios");

module.exports = (req, res) => {
  if (!req.body.authorizationCode) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
  const KAKAO_REDIRECT_URI = process.env.KAKAO_SIGNUP_REDIRECT_URI;
  const AUTHORIZATION_CODE = req.body.authorizationCode;
  const KAKAO_TOKEN_URL = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_CLIENT_ID}&client_secret=${KAKAO_CLIENT_SECRET}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${AUTHORIZATION_CODE}`;

  let kakaoUserInfo = {};

  axios
    .post(
      KAKAO_TOKEN_URL,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          accept: "application/json",
        },
      }
    )
    .then((response) => {
      const { access_token } = response.data;
      const KAKAO_USERINFO_URL = `https://kapi.kakao.com/v2/user/me`;

      return axios
        .get(KAKAO_USERINFO_URL, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            accept: "application/json",
          },
        })
        .then(async (response) => {
          if (response.data.kakao_account) {
            kakaoUserInfo.email = response.data.kakao_account.email;

            const realKakaoUserInfo = await user.findOne({
              where: { email: kakaoUserInfo.email },
            });

            if (realKakaoUserInfo) {
              return res
                .status(409)
                .send({ message: "이미 가입되어있는 이메일입니다." });
            } else {
              return res.status(200).send({ data: kakaoUserInfo.email });
            }
          } else {
            return res.status(500).send({ message: "카카오톡 유저정보 없음" });
          }
        });
    })
    .catch((e) => console.log(e));
};
