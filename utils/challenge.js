const Challenge_Exercise = require('../models/challenge_exercise');
const Challenge_Set = require('../models/challenge_set');

exports.find = (where) => {
  return {
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
