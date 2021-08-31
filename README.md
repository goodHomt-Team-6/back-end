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


## 4. 핵심 기능
이 서비스의 핵심 기능은 매일 운동을 하고 기록하는 기능입니다.  
사용자는 카테고리별로 운동을 선택하고, 타이머에 맞춰 운동을 할 수 있습니다.
이 단순한 기능의 흐름을 보면, 서비스가 어떻게 동작하는지 알 수 있습니다.  

<details>
<summary><b>핵심 기능 설명 펼치기</b></summary>
<div markdown="1">

### 4.1. 전체 흐름
![](https://zuminternet.github.io/images/portal/post/2019-04-22-ZUM-Pilot-integer/flow1.png)

### 4.2. 사용자 요청
![](https://zuminternet.github.io/images/portal/post/2019-04-22-ZUM-Pilot-integer/flow_vue.png)

- **URL 정규식 체크** :pushpin: [코드 확인](https://github.com/Integerous/goQuality/blob/b587bbff4dce02e3bec4f4787151a9b6fa326319/frontend/src/components/PostInput.vue#L67)
  - Vue.js로 렌더링된 화면단에서, 사용자가 등록을 시도한 URL의 모양새를 정규식으로 확인합니다.
  - URL의 모양새가 아닌 경우, 에러 메세지를 띄웁니다.

- **Axios 비동기 요청** :pushpin: [코드 확인]()
  - URL의 모양새인 경우, 컨텐츠를 등록하는 POST 요청을 비동기로 날립니다.

### 4.3. Controller

![](https://zuminternet.github.io/images/portal/post/2019-04-22-ZUM-Pilot-integer/flow_controller.png)

- **요청 처리** :pushpin: [코드 확인](https://github.com/Integerous/goQuality/blob/b2c5e60761b6308f14eebe98ccdb1949de6c4b99/src/main/java/goQuality/integerous/controller/PostRestController.java#L55)
  - Controller에서는 요청을 화면단에서 넘어온 요청을 받고, Service 계층에 로직 처리를 위임합니다.

- **결과 응답** :pushpin: [코드 확인]()
  - Service 계층에서 넘어온 로직 처리 결과(메세지)를 화면단에 응답해줍니다.

### 4.4. Service

![](https://zuminternet.github.io/images/portal/post/2019-04-22-ZUM-Pilot-integer/flow_service1.png)

- **Http 프로토콜 추가 및 trim()** :pushpin: [코드 확인]()
  - 사용자가 URL 입력 시 Http 프로토콜을 생략하거나 공백을 넣은 경우,  
  올바른 URL이 될 수 있도록 Http 프로토콜을 추가해주고, 공백을 제거해줍니다.

- **URL 접속 확인** :pushpin: [코드 확인]()
  - 화면단에서 모양새만 확인한 URL이 실제 리소스로 연결되는지 HttpUrlConnection으로 테스트합니다.
  - 이 때, 빠른 응답을 위해 Request Method를 GET이 아닌 HEAD를 사용했습니다.
  - (HEAD 메소드는 GET 메소드의 응답 결과의 Body는 가져오지 않고, Header만 확인하기 때문에 GET 메소드에 비해 응답속도가 빠릅니다.)

  ![](https://zuminternet.github.io/images/portal/post/2019-04-22-ZUM-Pilot-integer/flow_service2.png)

- **Jsoup 이미지, 제목 파싱** :pushpin: [코드 확인]()
  - URL 접속 확인결과 유효하면 Jsoup을 사용해서 입력된 URL의 이미지와 제목을 파싱합니다.
  - 이미지는 Open Graphic Tag를 우선적으로 파싱하고, 없을 경우 첫 번째 이미지와 제목을 파싱합니다.
  - 컨텐츠에 이미지가 없을 경우, 미리 설정해둔 기본 이미지를 사용하고, 제목이 없을 경우 생략합니다.


### 4.5. Repository

![](https://zuminternet.github.io/images/portal/post/2019-04-22-ZUM-Pilot-integer/flow_repo.png)

- **컨텐츠 저장** :pushpin: [코드 확인]()
  - URL 유효성 체크와 이미지, 제목 파싱이 끝난 컨텐츠는 DB에 저장합니다.
  - 저장된 컨텐츠는 다시 Repository - Service - Controller를 거쳐 화면단에 송출됩니다.

</div>
</details>

</br>

## 5. 핵심 트러블 슈팅
### 5.1. 예약된 스케쥴러가 서버가 재기동 시 사라지는 문제
- 이 서비스의 챌린지라는 기능이 있습니다. 정해진 날짜와 시간이 되면 챌린지에 참가한 사람들이 운동을 시작할 수 있는 상태 값으로 변경되는 스케쥴러를 설정해 두었습니다.
- 한가지 고민은 만약 어떠한 이유로 서버가 재기동 되면, 스케쥴러가 초기화 되는 것이 었습니다.
- 그래서 해결방안으로, 서버가 재시작될 때마다 해당 스케쥴러를 다시 설정하였습니다.

<details>
<summary><b>기존 코드</b></summary>
<div markdown="1">

~~~java
/**
 * 게시물 Top10 (기준: 댓글 수 + 좋아요 수)
 * @return 인기순 상위 10개 게시물
 */
public Page<PostResponseDto> listTopTen() {

    PageRequest pageRequest = PageRequest.of(0, 10, Sort.Direction.DESC, "rankPoint", "likeCnt");
    return postRepository.findAll(pageRequest).map(PostResponseDto::new);
}

/**
 * 게시물 필터 (Tag Name)
 * @param tagName 게시물 박스에서 클릭한 태그 이름
 * @param pageable 페이징 처리를 위한 객체
 * @return 해당 태그가 포함된 게시물 목록
 */
public Page<PostResponseDto> listFilteredByTagName(String tagName, Pageable pageable) {

    return postRepository.findAllByTagName(tagName, pageable).map(PostResponseDto::new);
}

// ... 게시물 필터 (Member) 생략 

/**
 * 게시물 필터 (Date)
 * @param createdDate 게시물 박스에서 클릭한 날짜
 * @return 해당 날짜에 등록된 게시물 목록
 */
public List<PostResponseDto> listFilteredByDate(String createdDate) {

    // 등록일 00시부터 24시까지
    LocalDateTime start = LocalDateTime.of(LocalDate.parse(createdDate), LocalTime.MIN);
    LocalDateTime end = LocalDateTime.of(LocalDate.parse(createdDate), LocalTime.MAX);

    return postRepository
                    .findAllByCreatedAtBetween(start, end)
                    .stream()
                    .map(PostResponseDto::new)
                    .collect(Collectors.toList());
    }
~~~

</div>
</details>

- 이 때 카테고리(tag)로 게시물을 필터링 하는 경우,  
각 게시물은 최대 3개까지의 카테고리(tag)를 가질 수 있어 해당 카테고리를 포함하는 모든 게시물을 질의해야 했기 때문에  
- 아래 **개선된 코드**와 같이 QueryDSL을 사용하여 다소 복잡한 Query를 작성하면서도 페이징 처리를 할 수 있었습니다.

<details>
<summary><b>개선된 코드</b></summary>
<div markdown="1">

~~~java
/**
 * 게시물 필터 (Tag Name)
 */
@Override
public Page<Post> findAllByTagName(String tagName, Pageable pageable) {

    QueryResults<Post> results = queryFactory
            .selectFrom(post)
            .innerJoin(postTag)
                .on(post.idx.eq(postTag.post.idx))
            .innerJoin(tag)
                .on(tag.idx.eq(postTag.tag.idx))
            .where(tag.name.eq(tagName))
            .orderBy(post.idx.desc())
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
            .fetchResults();

    return new PageImpl<>(results.getResults(), pageable, results.getTotal());
}
~~~

</div>
</details>

</br>

## 6. 그 외 트러블 슈팅
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
    Access To XMLHttpRequest at 'https://www.kingstar.shop/auth/kakaoLogin' from origin 'https://goodhomt.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check:
The 'Access-Control-Allow-Origin' header contains multiple valu '*, *', but only one is allowed.

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

## 6. 회고 / 느낀점
>프로젝트 개발 회고 글: https://zuminternet.github.io/ZUM-Pilot-integer/