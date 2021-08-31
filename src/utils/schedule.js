const Challenge = require('../models/challenge');
const Challenge_User = require('../models/challenge_user');
const CronJob = require('cron').CronJob;
const { deleteCacheById } = require('../utils/cache');

const startSchedule = async (dateTime, endDateTime, challengeId) => {
  if (dateTime.length === 12) {
    const date = dateTime.substr(6, 2);
    const hour = dateTime.substr(8, 2);
    const minute = dateTime.substr(10);
    const scheduleTime = `${minute} ${hour} ${date} * *`;

    //챌린지 종료시간 셋팅
    const end = async () => {
      await endSchedule(endDateTime, challengeId);
    };

    //챌린지 시작 스케쥴 셋팅
    const job = new CronJob(
      scheduleTime,
      async function () {
        await Challenge.update(
          { progressStatus: 'start' },
          {
            where: { id: challengeId },
          }
        );
        await initChallengeCach(challengeId);
        job.stop();
      },
      end,
      true,
      'Asia/Seoul'
    );
  } else {
    console.error('스케쥴 실패, 시작일 날짜형식이 잘못되었습니다');
  }
};

const endSchedule = async (endDateTime, challengeId) => {
  const date = endDateTime.substr(6, 2);
  const hour = endDateTime.substr(8, 2);
  const minute = endDateTime.substr(10);
  const endScheduleDateTime = `${minute} ${hour} ${date} * *`;
  const endJob = new CronJob(
    endScheduleDateTime,
    async function () {
      await Challenge.update(
        { progressStatus: 'end' },
        {
          where: { id: challengeId },
        }
      );
      await initChallengeCach(challengeId);
      endJob.stop();
    },
    null,
    true,
    'Asia/Seoul'
  );
};

const schedule = async () => {
  try {
    //시작 전 챌린지
    const startChallenges = await Challenge.findAll({
      where: { progressStatus: 'before' },
    });
    if (startChallenges.length > 0) {
      for (let i = 0; i < startChallenges.length; i++) {
        const { challengeDateTime, endDateTime, id } = startChallenges[i];
        startSchedule(challengeDateTime, endDateTime, id);
      }
    }
    //시작 후 챌린지
    const endChallenges = await Challenge.findAll({
      where: { progressStatus: 'start' },
    });
    if (endChallenges.length > 0) {
      for (let i = 0; i < endChallenges.length; i++) {
        const { endDateTime, id } = endChallenges[i];
        endSchedule(endDateTime, id);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

async function initChallengeCach(challengeId) {
  const challengeUsers = await Challenge_User.findAll({
    attributes: ['userId'],
    where: { challengeId },
  });

  await deleteCacheById(`allChallenge`);

  for (let i = 0; i < challengeUsers.length; i++) {
    const { userId } = challengeUsers[i];
    await deleteCacheById(`challengeForUser-undefined-${userId}`);
    await deleteCacheById(`challengeForUser-all-${userId}`);
  }
}

module.exports = { startSchedule, endSchedule, schedule };
