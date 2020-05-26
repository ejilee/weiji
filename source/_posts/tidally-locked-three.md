---
layout: posts
title: 조석 고정 시뮬레이터 III - 글리치
author: Weiji
tags: [React, styled components, tidal locking, tidally locked, 조석 고정]
categories:
  - [React]
date: 2020-05-26 12:58:47
---

방금 작업하면서 좀 얍삽한(?) 해결책을 쓰게되어 글로 남겨봅니다.

# 문제

계획대로 지난 주말까지 UI 구현은 다했는데, 작업 중 하나의 글리치가 발생했었습니다. UI 패널에 숫자 잇풋 박스 버튼 이것저것, 그리고 레인지 인풋 네개가 추가되었는데... 만들어논 레인지 (슬라이더) 인풋을 테스트 해보았을때, 첫 몇번은 바로바로 인풋 값이 에니메이션으로 반영이 되다가 꼭 몇번 이상 인풋을 사용하다보면 버벅거리며 에니메이션이 변형이 안 되었다가 또 다시 되었다가 하면서 렌더된 모습이 이상하게 바뀌는 문제가 발생했습니다. 스샷으로 보시죠...

![조석 고정 시뮬레이터 UI 글리치 화면 1](ss_glitch_1.png "처음엔 잘 되다가")

![조석 고정 시뮬레이터 UI 글리치 화면 2](ss_glitch_2.png "샥")

![조석 고정 시뮬레이터 UI 글리치 화면 3](ss_glitch_3.png "샥")

![조석 고정 시뮬레이터 UI 글리치 화면 4](ss_glitch_4.png "악")

...이렇게 말이죠. 예측 가능한 숫자에서 그러는 것도 아니고 그냥 몇번 인풋을 만지다 보면 이렇게 되는데, 저 모습은 마치 moon 컴포넌트가 사용하는 MOON-REVOLUTION 키프레임에 바뀐 공전 반경 프롭이 제대로 안 먹힌 모습입니다. 또 직접적으로 개발자 도구에서 공전 반경 상태값을 바꾸면 제대로 반영이 됩니다.

# 분석

초반에 작업해 놓은 moon 컴포넌트는 첫번쨰 관련 블로그 글에 설명했듯이 '자전 주기', '공전 주기', '공전 반경' 등의 상태를 프롭으로 받아와서 스타일드 컴포넌트에게 넘겨줍니다. 스타일드 컴포넌트 내부에서도 MOON-REVOLUTION 과 MOON-ROTATION이라는 키프레임을 정의해 놓고 moon 컴포넌트가 사용하게끔 작성했는데, 키프레인 안에서도 공전 반경 프롭을 사용합니다. 이렇게요 (공전 에니메이션 관련 코드 외에는 생략되었습니다) :

```javascript Moon.js
import React from "react";
import styled from "styled-components";

const StyledMoon = styled.div`
  position: absolute;
  z-index: 200;
  width: 100%;
  height: 100%;
  transform-origin: 50% 50%;
  animation-name: MOON-REVOLUTION;
  animation-duration: ${(props) => props.orbPer + "s" || "0s"};
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes MOON-REVOLUTION {
    0% {
      transform: rotate(0deg) translate(
          ${(props) => props.orbRad + "px" || "150px"}
        )
        rotate(0deg);
    }
    100% {
      transform: rotate(-360deg) translate(
          ${(props) => props.orbRad + "px" || "150px"}
        )
        rotate(360deg);
    }
  }
`;

const Moon = ({ orbPer, orbRad }) => {
  return (
    <StyledMoon orbRad={orbRad} orbPer={orbPer}>
      <div className="moon__self">
        <div className="moon__lockline" />
        <div className="moon__face" />
        <div className="moon__body" />
      </div>
      <div className="moon__shade" />
    </StyledMoon>
  );
};

export default Moon;
```

## 하지 말라는 짓

이 에니메이션이 캐싱이 되고있는 것 같은 느낌을 받았고, 구글에 'styled components cache animation' 라고 검색하니 스타일 컴포넌트 공식 홈 Basic 페이지가 최상위 검색 결과로 나왔고, 해당 Basics 페이지 에서 caching을 검색해보니 "Define Styled Components outside of the render method" 라는 해딩 아래로 주의문이 하나 있습니다.

> It is important to define your styled components outside of the render method, otherwise it will be recreated on every single render pass. Defining a styled component within the render method will thwart caching and drastically slow down rendering speed, and should be avoided.
>
> -- <cite>[styled-components Basics][1]</cite>

[1]: https://styled-components.com/docs/basics

그러니까 스타일드 컴포넌트를 렌더 메서드 밖에서 정의하라, 그렇지 않으면 매 랜더에 다시 생성되어야하고 그러면 **캐싱도 안 되고** 성등이 아주 많이 떨어지기 때문에 그런 방법은 피해야 합니다... 라고 합니다. 예시 주석에도 "WARNING: THIS IS VERY VERY BAD AND SLOW, DO NOT DO THIS!!!" 겁나 느리고 나빠요, 이렇게 하지 마세요!! 라고 써있습니다.

# 해결?

음? 캐싱이 안 된다고요? 그래서... 겁나 느리고 나쁘지만 ㅠㅠ 하지말라는 성능저하를 해보았습니다. 물론 딱 저 에니메이션 사용하는 부분만 분리해서요.

```javascript moon.js
import React from "react";
import styled from "styled-components";

const StyledMoon = styled.div`
  /* 자전 에니메이션 제외 나머지 스타일 코드 아직도 여기에 킵하고 */
`;

const Moon = ({ orbPer, orbRad }) => {
  const StyledRevolution = styled.div`
    position: absolute;
    z-index: 200;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    animation-duration: ${(props) => props.orbPer + "s" || "0s"};
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-name: MOON-REVOLUTION;

    @keyframes MOON-REVOLUTION {
      0% {
        transform: rotate(0deg) translate(
            ${(props) => props.orbRad + "px" || "150px"}
          )
          rotate(0deg);
      }
      100% {
        transform: rotate(-360deg) translate(
            ${(props) => props.orbRad + "px" || "150px"}
          )
          rotate(360deg);
      }
    }
  `;

  return (
    <StyledRevolution orbRad={orbRad} orbPer={orbPer}>
      <StyledMoon>
        <div className="moon__self">
          <div className="moon__lockline" />
          <div className="moon__face" />
          <div className="moon__body" />
        </div>
        <div className="moon__shade" />
      </StyledMoon>
    </StyledRevolution>
  );
};

export default Moon;
```

이렇게 했더니 글리치가 사라졌습니다. 딱히 엄청 버벅거린다거나 느리거나도 잘 못느끼겠고, 물론 스타일드 컴포넌트 전체를 저런식으로 랜더 부분에 정의하면 성능상 엄청 안 좋을 것 같긴 합니다. 일단 문제를 해결하긴 했는데, 뭔가 찝찝한 느낌...
