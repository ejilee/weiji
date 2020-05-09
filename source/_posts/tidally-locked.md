---
title: 조석 고정 시뮬레이터 I
author: Weiji
tags: [react, styled components, tidal locking, tidally locked, 조석 고정]
categories:
  - [React]
date: 2020-02-23 12:29:06
---

# 조석 고정?

> 조석 고정(潮汐固定, Tidal locking)은 어떤 천체가 자신보다 질량이 큰 천체를 공전 및 자전할 때 공전주기와 자전주기가 일치하는 경우를 의미한다. 이 경우 천체의 한쪽 반구는 영원히 자기보다 큰 천체를 그 반대방향은 영원히 상대 천체를 등지게 된다.
>
> -- <cite>[위키피디아 '조석 고정'][1]</cite>

[1]: https://ko.wikipedia.org/wiki/%EC%A1%B0%EC%84%9D_%EA%B3%A0%EC%A0%95

지구에서 달의 한쪽 면 밖에 볼 수 없는 이유이기도 하다.

예전에 천문학 수업 과제로 이 개념을 플레시 애니메이션으로 만들어서 제출했던 적이 있었다. 당시 굉장히 기본적인 기능만 있었고, 예쁘지도 않고, 플레시(...) 였지만 개념을 익히는데는 도움이 됐던 것 같다. 그때의 플레시 파일은 지금 열리지도 않는다. 리액트로 기능 추가! 스타일 추가! 해서 다시 만들어보았다. 누군가의 천문학 수업에 좋은 학습자료가 되었으면...?

## 10년 전 플레시 애니메이션

거의 10년전에 만들었던 플레시 애니메이션의 겨우 발굴한 스샷 :

{% asset_img "ss1.jpg" "tidal locking visualizer flash animation" %}

당시 나름 액션 스크립트로 요리조리 삼각법 써서 했던 것 같은데... 요즘 css가 워낙 똑똑해서 삼각법 따위는 필요 없어졌다! 동작하는 부분들은 사실 만드는데 얼마 걸리지도 않았지만, 세세한 ui 부분이나 추가적인 기능들이 욕심이 나는 게 있어서 손을 좀 봐야할 것 같다.

## 10년 후 다시만든 리액트 앱

{% asset_img "ss2.png" "조석 고정 시뮬레이터 작업 전 모습" %}

기본적인 공전 주기와 자전 주기 조절기능은 잘 구현된다. Styled component를 사용해서 컴포넌트에 던진 프롭으로 바로 css transform 속성에 반영하니까 코드도 그렇게 많지 않았다.

[여기서 확인 - Tidally Locked](https://tidallylocked.com/) / [코드는 여기](https://github.com/ejilee/Tidally-Locked)

## 추가로 구현하고픈

가장 최근에 커밋한게 2주 전인걸 보면, 그 사이에 헥소 블로그 만드느냐고 아예 손을 안썼었다. 하지만 또 여러가질 고칠 점을 생각해 볼 수 있는 시간이었던 것 같다.

- 리드미 파일 수정
- 조석 고정이 아닌 상태에서 조석 고정 상태가 되었을 때 '짜잔'하는 에니메이션이나 이펙트가 있었으면
- 조석 고정 상태를 유지하고 있을 때 점선 같은 시각적 표기가 있었으면
- Reset, Tidal Lock, Pause 같은 기능성 버튼이 있었으면
- 버튼과 인풋 외관 수정. 중요한 것만 빼내고 나머지는 옵션으로 작게 혹은 숨기기
- 공전 경로 동그라미가 상태 변경시 사라지는 문제 수정
- 천체 (달과 지구)에 문양이나 모양/색 등을 선택할 수 있게 해서 달에 별도 마커가 없어도 자전이 보이도록. 혹은 마커 표시를 옵션으로 체크 할 수 있게.
- 지구도 자전할까? 굳이?
- 햇빛의 방향도 천천히 360도 회전하게 하면 좀 더 멋있으려냐? 성가실려나?

이런 것들이 있다. 일단 이것들을 시도해보기 전에, 어떤 식으로 구현되는지 설명해보겠다. (사실 나도 복습해야함...)

# Styled Components

실은 나도 얼마전까지만해도, '음... 스타일드 컴포넌트... 굳이??' 라고 생각했었는데. 이번 프로젝트에 특히 유용하게 사용했다. 물론 모든 경우에 사용할 필요는 없다고 생각한다. 하지만 이런 식으로 스타일이 딱딱딱 개별 컴포넌트로 잘 나눠지는 경우에, 특히 **프롭 값을 스타일에 바로 반영해서** 사용할 일이 있을 때! 정말 좋은 것 같다. 이전에 억지로 배워보겠다고 이미 사용하고 있던 sass 변수를 새로 만든 스타일드 컴포넌트에서 사용하려다가 스트레스 받은 적이 있었는데, 경우를 잘 봐서 써야할 것 같다.

이 프로젝트에서 유심히 볼 부분은 Moon 컴포넌트와 그 안에 있는 스타일드 컴포넌트들이다. 그 밖에 앱 안에는 Interface.js 라는 컴포넌트에 왼쪽으로 보이는 인풋들이 위치해 있다. Planet.js, OrbitLine.js, Space.js 컴포들도 있지만, 여기에서는 별일이 일어나지 않는다. Moon 컴포넌트를 들여다보자.

## Moon.js

위 스샷에 있는 노란색 동그라미가 Moon.js 컴포넌트인데, 실은 눈에 보이지 않는 100% x 100% 크기의 사각형 StyledMoon 스타일드 컴포넌트가(여기서 부터는 그냥 **스컴포** 라 부르겠다) 하나 있고, 그 중앙에 동그라미 스컴포 두개가 겹쳐져있다. 하나는 달의 몸뚱이인 노란색 MoonBody, 하나는 그림자만 갖고있는 음영 동그라미 MoonLight. 달몸뚱이 스컴포 안에는 달의 '얼굴' MoonFace, 그러니까 어느쪽을 바라보고 있는지 표시하는 마커가 튀어나와있는 부분, 을 갖고 있는 스컴포가 하나 더 있다.

```html Moon.js 의 구조
<StyledMoon>
  <MoonBody>
    <MoonFace></MoonFace>
  </MoonBody>
  <MoonLight />
</StyledMoon>
```

## Props

지금 Moon.js 컴포넌트에게 던져지는 프롭은 :

- rotPer (자전주기, rotational period)
- orbPer (공전주기, orbital period)
- orbRad (공전 반경, orbit radius)
- mooSiz (달 크기, moon size)
- sunDir (햇빛 방향, sun direction)

이렇게 다섯개이고, 이런식으로 4개의 스컴포 사이에서 다음처럼 사용되고 있다 :

```html Moon.js 의 프롭 사용
<StyledMoon orbPer="{orbPer}" orbRad="{orbRad}">
  <MoonBody rotPer="{rotPer}" mooSiz="{mooSiz}">
    <MoonFace></MoonFace>
  </MoonBody>
  <MoonLight mooSiz="{mooSiz}" sunDir="{sunDir}" />
</StyledMoon>
```

정리하자면, StyledMoon 스컴포 (컨테이너 사각형)은 공전 관련된 프롭만 사용한다. MoonBody는 자전주기와 달 크기를 사용하고, MoonFace는 그냥 고정이다. MoonLight도 MoonBody와 같은 달 크기 프롭을 사용하지만, 회전은 하지 않음으로 자전주기를 사용하지 않고 대신에 햇빛 방향이라는 프롭을 사용해서 음영의 방향을 조절한다.

# Animation

처음에 쉽게 생각하다 에니메이션 부분에서 잠깐 함정에 빠졌었다. 단순히 '컨테이너 사각형을 orbPer 값을 사용해서 회전시키고, 동그라미 컴포넌트를 rotPer 값을 사용해서 회전시키면 되는 거 아님??' 이라고 생각했었는데, 결과가 이상했다. 이건 예시로 봐야 더 명확할 듯.

## 그냥 회전

애초에 간단하게 생각했던 것 처럼 우선 HTML/CSS를 사용하는 예시를 만들어서 컨테이너 사각형을 회전시켜보자.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="whyejilee" data-slug-hash="PoqbXxX" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="TidallyLockedDemo1">
  <span>See the Pen <a href="https://codepen.io/whyejilee/pen/PoqbXxX">
  TidallyLockedDemo1</a> by Yeji Lee (<a href="https://codepen.io/whyejilee">@whyejilee</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 그냥 회전의 문제점

그냥 봐서는 뭐가 틀린 것 같지는 않은데, 공전과 자전은 분리해서 관리하고 싶다면 문제가 생긴다. 지금 하얀 외관선을 가진 StyledMoon 컨테이너가 공전 애니메이션을 10초 주기로 한번씩 실행하고 있다. (CSS 에서 '공전 애니메이션'이라고 주석 표시) 잘 돌아가는데... 컨테이너 안에 있는 'M'이라고 쓰인 MoonBody 요소는 그저 부모 요소가 돌아가니까 붙어서 잘 돌아가고 있는 것이다. 하지만 이 부분이 문제이다. 추후에 MoonBody에 자전 애니메이션을 만들어서 자전을 별도로 관리하려고 한다면, 공전 때문에 생기는 회전 각도까지 감안해서 계산해야 할 것이다. 으으.. 수학. 생각하고 싶지 않다.

이렇게 생각해보면 좋을 것 같다. StyledMoon 컨테이너는 본인이 이미 회전하고 있기 때문에 MoonBody 자식 요소를 봤을 때, MoonBody는 회전하고 있지 않다. 하지만 전체 화면, 그러니까 회색 배경의 div#space의 입장에서 봤을 때, MoonBody는 확실히 회전하고 있다. 우리가 보기에 글자 "M"이 중간중간 뒤집혀 보이는 것만 보면 알 수 있다.

우리가 원하는 것은 우선 공전 애니메이션이 실행 됐을 때 StyledMoon 컨테이너는 회전하고, 안에 있는 MoonBody 요소는 회전하지 않는 것이다 (자전은 없음). 그러니까, 저 "M" 이 뒤집히면 안 된다는 것이다.

## 해답 : 회전 > 이동 > 반회전

아주 간단한 해답을 다음 글에서 찾았다 :

[Moving an Element Along a Circle](http://lea.verou.me/2012/02/moving-an-element-along-a-circle/)

공전 에니메이션에 적용되는 transform 속성에 추가로 translate와 rotate을 한 번씩 더 채인 시키는 것이다.

우선 지금 MoonBody 의 CSS 속성에서 `transform: translate(100px);` 을 없애주어야 한다. StyledMoon 정중앙에 다시 위치하게 하고, StyledMoon 컨테이너 자체를 이동시켜줄 것이다.

그래서 아래 같았던 키프레임을

```css
@keyframes MOON-REVOLUTION {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
```

아래처럼 고쳐주었다.

```css
@keyframes MOON-REVOLUTION {
  0% {
    transform: rotate(0deg) translate(100px) rotate(0deg);
  }
  100% {
    transform: rotate(-360deg) translate(100px) rotate(360deg);
  }
}
```

처음에 했던 것처럼 회전은 똑같이 0 에서 -360도 실행한다. 하지만 각 프레임에서 조금 회전 할 때마다 100px우측으로 이동하고 또 이번에는 -360도가 아닌 360도 방향으로 다시 움직인다. 그러니까 1도 회전 단위로 생각해보면, 우선 시계 반대 방향으로 1도 회전한다. 그리고 회전된 상태에서 우측으로 100px 이동한다. (그러면 중앙에 있던 MoonBody 요소도 우측으로 이동한다, 위에서 transform 값 없애준 이유) 그 후 다시 시계 방향으로 1도 회전한다. 그러면 공전은 하지만, StyledMoon 요소가 earth 요소 주위를 공전하는 모양이 나오지만, 화면에 비해서는 회전하지 않는, 자전하지 않는 모습이 표현된다.

다음처럼!

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="whyejilee" data-slug-hash="poJNGoy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="TidallyLockedDemo2">
  <span>See the Pen <a href="https://codepen.io/whyejilee/pen/poJNGoy">
  TidallyLockedDemo2</a> by Yeji Lee (<a href="https://codepen.io/whyejilee">@whyejilee</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

# 여기까지

가장 큰 문제는 이렇게 해결했다. 그 후에 위 예시를 React Styled Component로 다시쓰고 인풋 요소를 만들어서 공전 주기, 자전 주기 등의 상태를 직접 조절할 수 있도록 만든 것이다. 오늘은 <a href="#추가로-구현하고픈">추가로 구현하고픈</a> 에 써있는 걸 해결하는 작업을 하려고 했는데, 어쩌다 보니 이미 해논 걸 설명하는 것 밖에 하지 못헀다. 역시 블로그를 너무 만만하게 생각했다, 그래도 복습에 도움은 되는 듯. 그럼 조석 고정 시뮬레이터 관련 글은 시리즈로 만들어서 다음 편에서 수정하는 것을 다루겠다. 1편은 여기까지.
