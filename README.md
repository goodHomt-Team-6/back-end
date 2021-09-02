# :pushpin: GoodHomt
>운동을 기록하고, 공유하는 서비스
>https://goodhomt.com

</br>

## 1. 제작 기간 & 참여 인원
- 2021년 7월 23일 ~ 8월 31일
- 팀 프로젝트
  - Back-end
    - 김영록
    - 이대성  
  - Front-end
    - 박경준
    - 우지음
  
</br>

## 2. 사용 기술
#### `Back-end`
  - Node 14.7
  - Express 4.17
  - Sequelize 6.6
  - Artillery 1.7
  - Cron 1.8
  - MySQL 8.0.23
  - Docker 20.10
  
#### `Front-end`
  >https://github.com/goodHomt-Team-6/front-end

</br>

## 3. ERD 설계
![](https://user-images.githubusercontent.com/47413926/131307950-2b43afbd-6c33-4b9f-8f7a-8a80b54affd3.png)

## 4. 아키텍쳐
![](https://user-images.githubusercontent.com/47413926/131871476-9f0b9738-df0a-4dda-83fa-b52ae3ae013e.png)

## 5. 핵심 기능
이 서비스의 핵심 기능은 매일 운동을 하고 기록하는 기능입니다.  
사용자는 카테고리별로 운동을 선택하고, 타이머에 맞춰 운동을 할 수 있습니다.

<details>
<summary><b>핵심 기능 설명 펼치기</b></summary>
<div markdown="1">

### 5.1. 동적인 검색조건을 가진 검색 API

- **검색조건 동적 할당** :pushpin: [코드 확인](https://github.com/DaeseongLee/node_health/blob/main/src/controllers/routines.js#L19)
  - 프론트에서 보내주는 검색조건을 확인합니다.
  - 조건에 맞는 쿼리의 where 조건 문을 동적으로 할당합니다.

- **조회된 데이터 캐싱** :pushpin: [코드 확인](https://github.com/DaeseongLee/node_health/blob/main/src/controllers/routines.js#L39)
  - 한번 조회 된 조건으로 검색된 데이터를 캐싱 해 둬서, 다음 조회 시 DB에 접속 하지 않도록 합니다.

### 5.2. 기존에 있던 루틴과 값을 비교하여, 새롭게 수정 또는 삭제

- **기존 루틴과 비교 후 수정** :pushpin: [코드 확인](https://github.com/DaeseongLee/node_health/blob/main/src/controllers/routines.js#L271)
  - 사용자가 한번에 요청으로, 기존의 루틴과 비교하여 삭제하거나 수정하는 기능입니다.

### 5.3. Challenge Scheduler

- **챌린지 시작** :pushpin: [코드 확인](https://github.com/DaeseongLee/node_health/blob/main/src/utils/schedule.js#L6)
  - 앞으로 있을 챌린지 시작 시간을 미리 예약합니다. 
  - 현재 schedule 관리해주는 모듈 중에 가장 많이 사용하는 cron을 사용하였습니다.
  

- **챌린지 끝** :pushpin: [코드 확인](https://github.com/DaeseongLee/node_health/blob/main/src/utils/schedule.js#L40)
  - 챌린지가 시작되고, 챌린지 수행시간이 지나면 챌린지의 끝을 DB에 알려 줍니다.
  
</div>
</details>

</br>

## 6. 부하테스트
![](https://user-images.githubusercontent.com/47413926/131869977-4ff8e345-849f-4642-bd6f-f26ff2db7c09.png)

## 7. 핵심 트러블 슈팅
### 7.1. 예약된 스케쥴러가 서버가 재기동 시 사라지는 문제
- 이 서비스의 챌린지라는 기능이 있습니다. 정해진 날짜와 시간이 되면 챌린지에 참가한 사람들이 운동을 시작할 수 있는 상태 값으로 변경되는 스케쥴러를 설정해 두었습니다.
- 한가지 고민은 만약 어떠한 이유로 서버가 재기동 되면, 스케쥴러가 초기화 되는 것이 었습니다.
- 그래서 해결방안으로, 서버가 재시작될 때마다 해당 스케쥴러를 다시 설정하였습니다.


### 7.2. 부모테이블의 데이터를 삭제 시, 자식 테이블의 데이터를 일일히 삭제해야 하는 문제
- 정합성을 위해, 부모 테이블의 데이터를 삭제하면 동시에 자식 테이블의 데이터를 삭제해야하는 비효율적인 문제가 있었습니다.
- 처음에는 삭제할려는 부모 테이블의 foreign key를 이용해서 자식테이블을 삭제하고, 부모테이블을 삭제하는 방식이었습니다.

<details>
<summary><b>기존 코드</b></summary>
<div markdown="1">

~~~jsx
    //부모테이블 조회
    const routine = await Routine.findOne({
      where: { id: routineId },
    });

    //부모테이블의 id로 자식 테이블 조회
    const routine_exercise = await Routine_Exercise.findOne({
      where: { routineId: routine.id },
    });

    //자식 테이블의 자식테이블 삭제
    await Set.destroy({
      where: { routineExerciseId: routine_exercise.id }
    });

    //자식 테이블 삭제
    await Routine_Exercise.destroy({
      where: { routineExerciseId: routine_exercise.id }
     });
    
    //부모 테이블 조회
    await Routine.destroy({
      where: { routineExerciseId: routine_exercise.id }
     });
~~~
</div>
</details>

- 찾아보니 ON DELETE CASCADE라는 제약사항을 통해, 부모테이블이 삭제 될 시 자동으로 자식 테이블의 삭제되는 옵션을 사용하였습니다.
- 아래 **개선된 코드**와 같이 제약 조건을 수정 하였습니다.

<details>
<summary><b>개선된 코드</b></summary>
<div markdown="1">

~~~jsx

//sequelize 설정 변경
db.Routine_Exercise.belongsTo(db.Routine, {
      foreignKey: 'routineId',
      targetKey: 'id',
      onDelete: 'CASCADE',
    });

//mysql 제약조건 변경
ALTER TABLE `node_health`.`routine_exercise` ADD CONSTRAINT FOREIGN KEY (routineId) REFERENCES routine(id) ON DELETE CASCADE;
ALTER TABLE `node_health`.`set` ADD CONSTRAINT FOREIGN KEY (routineExerciseId) REFERENCES `node_health`.`routine_exercise`(id) ON DELETE CASCADE;
~~~

</div>
</details>

</br>

## 8. 그 외 트러블 슈팅
<details>
<summary>202108300800 숫자가 ⇒ DB에서는 2147483647로 찍히는 현상</summary>
<div markdown="1">

- 원인: Mysql에서 INT의 최대값이 넘어서 최대값인 2147483647 찍어주는 현상
- 해결: challengeDateTime 타입을 BIGINT로 바꿈

</div>
</details>

<details>
<summary>travis CI, CD 에서 배포를 할 때 발생한 에러 </summary>
<div markdown="1">

  ```jsx
    //에러메세지
    The deployment failed because no instances were found for your deployment group.
Check your deployment group settings to make sure the tags for your Amazon 
EC2 instances or Auto Scaling groups correctly identify the instances you want 
to deploy to, and then try again.

  ```
  - 원인: CodeDeploy 환경구성에 Amazon EC2 인스턴스 설정을 잘못함
  - 해결 codeDeploy와 맞는 ec2에 태그 설정
  
</div>
</details>

<details>
<summary>무중단 배포시 502 Bad Gateway </summary>
<div markdown="1">
  
  - 원인: fail_timeout보다 app서버가 늦게 빌드 되서 떨어지는 원인.
  - 해결: fail_timeout의 시간을 늘려줌.
  
</div>
</details>

<details>
<summary> CORS 에러 </summary>
<div markdown="1">
  
   ```jsx
    //에러메세지
    Access To XMLHttpRequest at 'https://www.kingstar.shop/auth/kakaoLogin' from origin 'https://goodhomt.com' has been blocked by CORS policy: 
    Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header contains multiple 
    valu '*, *', but only one is allowed.

  ```
  - 원인: proxy 서버인 nginx에서도 cors설정을 해주고, node 서버에서도 cors설정을 해서 중복된 cors설정으로 인해 발생한 오류
  - 해결: nginx의 cors설정제거
  
</div>
</details>
    
<details>
<summary> Dockerfile로 app을 container를 뛰울 때, mysql빌드할 때 발생한 에러 </summary>
<div markdown="1">

  - 원인: 파일을 읽을 수 있는 권한이 없어서 발생한 문제
  - 해결: sudo chmod 755 -R .  권한을 주어서 해결
   
</div>
</details>    

<details>
<summary> app과 sequelize ORM을 연결할 때 발생환 에러</summary>
<div markdown="1">

  ```jsx
    //에러메세지
   User.hasMany called with something that's not a subclass of Sequelize.Model

  ``` 
  - 원인: 관계를 맺은 모델을 찾을 수 없어서 발생한 에러
  - 해결: 관계 맺은 모델을 import 해오도록 설정
   
</div>
</details>    

<details>
<summary> 카카오톡 로그인할 때, accessToken을 발급받아야 하는데, kakao API 요청을 하면 401에러가 발생</summary>
<div markdown="1">

  - 원인: API를 사용하여 토큰을 받을 권한이 없어서 발생한 문제
  - 해결: 카카오톡 API 설정에서 허용 IP 주소를 입력해서 해결
        
</div>
</details>  
    
<details>
<summary>프록시 서버인 nginx를 설정하고, 해당 IP 주소로 요청을 보내면 502 Bad Gateway라는 에러발생</summary>
<div markdown="1">

  - nginx에서 잘못된 경로로 redirect 보내기 때문에 발생한 원인
  - nginx에서 정상적인 경로를 찾을 수 있도록 nginx.conf 파일안에서 경로 수정.
        
</div>
</details> 
    
</br>

## 9. 회고 / 느낀점
>