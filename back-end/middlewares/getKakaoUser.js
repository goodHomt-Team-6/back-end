const axios = require('axios');
exports.getKakaoUser = async (req, res, next) => {
  const {
    token: { access_token },
  } = req.body;

  try {
    const Authorization = `Bearer ${access_token}`;
    const profile = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        'content-Type': 'application/x-www-form-urlencoded',
        Authorization,
      },
    });
    req.kakao = profile;
    console.log('profile!!!!', profile.data);

    // req.kakao = {
    //   id: 1834436063,
    //   connected_at: '2021-08-03T12:57:02Z',
    //   properties: {
    //     nickname: '왕별',
    //   },
    //   kakao_account: {
    //     profile_needs_agreement: false,
    //     profile: {
    //       nickname: '왕별',
    //       thumbnail_image_url:
    //         'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg',
    //       profile_image_url:
    //         'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
    //       is_default_image: true,
    //     },
    //     has_email: true,
    //     email_needs_agreement: false,
    //     is_email_valid: true,
    //     is_email_verified: true,
    //     email: 'yds5539@hanmail.net',
    //     has_age_range: true,
    //     age_range_needs_agreement: false,
    //     age_range: '30~39',
    //     has_birthday: true,
    //     birthday_needs_agreement: false,
    //     birthday: '0615',
    //     birthday_type: 'SOLAR',
    //     has_gender: true,
    //     gender_needs_agreement: false,
    //     gender: 'male',
    //   },
    // };
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
