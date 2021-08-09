const httpMocks = require('node-mocks-http');
// jest.mock('../../models/user');
const Challenge = require('../../models/challenge');
const challengeController = require('../../controllers/challenge');
const newData = require('../data.json');

describe('ChallengeRoutes', () => {
  describe('전체 challenge 가져오기', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    res.json = jest.fn();
    Challenge.findAll = jest.fn();
    it('allChallenge는 함수이어야 함', () => {
      expect(typeof challengeController.allChallenge).toBe('function');
    });
    it('allChallenge에서 findAll함수가 한번 호출 되어야 함', async () => {
      await challengeController.allChallenge(req, res);
      expect(Challenge.findAll).toBeCalledTimes(1);
    });
    it('allChallenge에서 정상적으로 findAll함수가 호출 되었을 때, res는 200상태를 응답해야함', async () => {
      await challengeController.allChallenge(req, res);
      expect(res.statusCode).toBe(200);
    });
    it('allChallenge에서 비정상적으로 findAll함수가 호출 되었을 때, res는 error값을 응답해야 함', async () => {
      Challenge.findAll = jest.fn(() => {
        throw new Error();
      });
      await challengeController.allChallenge(req, res);
      expect(res.statusCode).toBe(500);
    });
  });

  //   // it.todo('사용자별 참가 전 challenge 가져오기');
  //   // it.todo('사용자별 참가 후 challenge 가져오기');
  //   // it.todo('챌린지별 상세 데이터 가져오기');
  //   // it.todo('챌린지 등록하기');
  //   // it.todo('챌린지 기록하기');
  //   // it.todo('챌린지 참여하기');
  //   // it.todo('챌린지 참여취소하기');
});
