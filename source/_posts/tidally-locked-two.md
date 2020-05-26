---
title: 조석 고정 시뮬레이터 II - 디자인
author: Weiji
tags:
  [React, styled components, tidal locking, tidally locked, 조석 고정, Figma]
categories:
  - [React]
  - [Design]
date: 2020-05-20 11:50:21
---

이번주 안에 조석 고정 시뮬레이터를 완성하고 싶어서 요렇게 목표 기록 포스팅을 합니다.

# 해결할 사안들

- 조석 고정이 아닌 상태에서 조석 고정 상태가 되었을 때 시각적으로 무언가 표시
- Reset, Tidal Lock, Pause 같은 기능성 버튼
- 버튼과 인풋 외관 수정. 중요한 것만 빼내고 나머지는 작게/숨기기/자동계산
- 공전 경로 동그라미가 상태 변경시 사라지는 문제 수정

# 다자인 다시

일단 앱의 현 상태를 확인해봅니다. 이전 포스팅 할 때는 이랬던 게 :

{% asset_img "tdlk_2.png" "조석 고정 시뮬레이터 UI 드레프트" %}

Material UI를 배우고 나서 이렇게 되었는데요. ㅎㅎㅎ
{% asset_img "tdlk_3.png" "조석 고정 시뮬레이터 단순 UI 버전" %}

사실 좀 안 어울리는 것 같습니다. 커스터마이징하고싶은 부분이 많아서... Material UI는 뺴고 아예 레이아웃 디자인부터 좀 정하고 진행하기로 했습니다. 간만에 Figma를 키고...레이아웃은 세 규격으로 짰습니다.

{% asset_img "tdlk_figmadraft.png" "조석 고정 시뮬레이터 디자인 시안" %}

이번주 안에 완성할 수 있기를... 다른 거 좀 할래!
