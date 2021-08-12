const Challenge_Exercise = require('../models/challenge_exercise');
const Challenge_Set = require('../models/challenge_set');
const Challenge_User = require('../models/challenge_user');
const { sequelize } = require('../models');
exports.find = (where) => {
  return {
    attributes: {
      include: [
        [
          sequelize.literal(`(
                    SELECT COUNT(userId)
                      FROM challenge_user AS challengeUser
                     WHERE
                        challengeUser.challengeId = challenge.id
                )`),
          'userCount',
        ],
      ],
    },
    order: [['challengeDateTime', 'DESC']],
    where,
    include: [
      {
        model: Challenge_Exercise,
        attributes: ['exerciseName'],
        order: [['id'], ['ASC']],
        include: [
          {
            model: Challenge_Set,
            attributes: [
              'id',
              'setCount',
              'weight',
              'count',
              'minutes',
              'seconds',
              'type',
              'order',
            ],
            order: [['order'], ['ASC']],
          },
        ],
      },
    ],
  };
};

exports.getDeadLineYn = async (challengeId) => {
  const [result, metadate] =
    await sequelize.query(`SELECT ( case when date_format(now(), '%Y%m%d%H%i')-C.challengeDateTime >= 0 then 'end' 
                                            ELSE 'start'
	                             END ) as status
                               from challenge as C where id = ${challengeId};`);
  return result[0]?.status;
};
