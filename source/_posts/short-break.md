---
title: 회상, 혼자서 공부하기
author: Weiji
tags: [React, Server Side Rendering, Webpack, Babel]
categories:
  - [React]
date: 2020-05-13 20:03:04
---

이전 포스트가 거의 3개월 전이었네요, 그동안 세상에 많은 일이 있었습니다. 저는 3월부터 퍼블리셔 직을 그만두고 집에만 있었는데... 왜 블로그는 안 썼을까요. (반성) 혼자서 정신없이 이것저것 공부한다고 한 것들이 있는데... 전부 영상 튜토리얼 위주로 하다보니 결과라고 보여줄만한 뭔가가 없네요. 회사다닐때는 그래도 주말에 스터디 카페 등록해놓고 돈 안 아까우려고 꾸준히 다녀서 주말마다 커밋들이 있었는데. 바이러스 때문에 카페도 못가고 혼자 집에 방치되니 흔히 말하는 **tutorial hell** 이라는 것에 빠졌던 것 같습니다.

지난 3개월 동안 튜토리얼 헬 속에서 배운 것들 :

- Material UI
- server side rendering : why & how
- webpack & babel
- starting a react project from scratch (without CRA)
- SSR with React Router
- bundle size optimazation

...이런 커리큘럼을 밟은 가장 큰 이유는 Code Realm님의 Material UI 튜토리얼 덕분입니다. 초반에는 조석 고정 시뮬레이터 인터페이스 만드는데 **시간을 아끼고 싶어서** Material UI를 배우러 들어갔다가...(야무진 꿈) 후- 영상이 너무 배움으로 꽉꽉 차있는 바람에, 플레이리스트 전부 돌려보고 특히 40분짜리 SSR관련 영상은 일주일동안 여러차례 돌려봤는데요. 덕분에 제가 모르는 부분이 많다는 걸 배우고 최대한 매꾸려다보니... 앗 벌써 시간이 이렇게 흘러버렸습니다.

이전까지는 리액트를 Create React App을 기본으로 깔고 배우다보니까 기본적인 bundler 와 compiler (webpack & babel) 에 대한 지식이 너무 없었던 것 같습니다. 서버에 대한 지식도 없어서 SSR 구현 부분에서 좀 괴로웠고... 그래도 따라하다보니 이제 cra 없이 기본적인 프로젝트 설정하는 법은 이해가 되는 것 같습니다. 앞으로도 서버 관련된 부분은 차차 배워나가야 하겠지만 Next.js 가 몹시 배우고 싶어졌습니다. (또 또 야무진 꿈)

그래서 결과적으로 조석 고정 시뮬 인터페이스는 아직도 안 고쳤다는 놀라운 사실. 튜토리얼 헬을 빠져나와서 사이드 프로젝트들을 좀 더 완성시키는 시간을 가져야 할 것 같습니다.

# 튜토리얼 헬 플레이리스트

아래 도움이 됐던 튜토리얼 몇가지 링크해봅니다, 당신도 빠져보아요 튯 늪 :

## Starting a Project with Webpack & Babel

- [Design Course, Webpack 4 Tutorial - Getting Started for Beginners](https://www.youtube.com/watch?v=TzdEpgONurw)
- [Tyler McGinnis, React (without Create React App) with Babel 7, Webpack 4, and React 16](https://www.youtube.com/watch?v=Zb2mQyQRwqc)
- [Code Realm, Deconstructing Create-React-App with Webpack 4 & Babel](https://www.youtube.com/watch?v=A4swyDR45SY)

## Optimizing Bundle Size

- [Code Realm, Learn React & Material UI - #16 Optimizing Bundle Size](https://www.youtube.com/watch?v=CGgEPHwzCUU) - 이 시리즈는 영상 19개로 나눠져있습니다. Material UI 배우러 들어갔다가 SSR 배우고 나오게 되는 바로 그 마법의 경로.

## Server Side Rendering

- [Code Realm, Learn React & Material UI - #17 Server-Side Rendering](https://www.youtube.com/watch?v=gpGoxdVspx4) - 일주일간 돌려보기한 문제의 그 영상
- [Tyler McGinnis, Server Rendering with React and React Router v4](https://www.youtube.com/watch?v=mZEv4mHsU5E) - React Router를 SSR이랑 병행해서 사용하는 예시가 단계별로 잘 설명되어 있습니다
