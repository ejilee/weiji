---
title: TOC 목차 만들기
author: "Yeji"
tags: [ Hexo, CSS, JavaScript, TOC, 목록, Inersection Observer ]
categories:
  - [CSS]
  - [JavaScript]
date: 2020-02-15 15:35:57
---

*혹시 블로그 index에서 보고계시면 해당 글 제목을 클릭해서*
*글 고유 페이지로 들어오셔야 목차를 보실 수 있습니다.*
*목차는 데스탑에서만 보입니다.*

# 내가 원하는 목차

블로그 글이 길어질 것을 감안하여 목차를 보여주고 싶었습니다.
사실 다른 헥소 테마에 글 목차 기능이 있는 걸 보았는데,
제대로 작동하지도 않고 코드가 잘 정리되어있지 않아서 수정하다말고 버렸습니다.
그냥 기본 landscape 테마를 다 수정한 후에 목차는 마지막에 별도로 추가하게 되었는데요.
제가 만들어 볼 목차는 :
- 글 왼쪽으로 sticky 하게 붙어있어야 한다.
- 현재 보고 있는 헤딩이 목차 내에서 강조된다.
- 목차 내 원하는 제목을 클릭하면 해당 내용으로 스크롤링 되어야한다.

마침 최근에 관련된 글을 읽어서 응용해볼까 합니다.

## 참고 블로그 글

Bramus님이 깔끔하게 정리해주신 글입니다 : (영문)
[Smooth Scrolling Sticky ScrollSpy Navigation](https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation)

## Hexo Helper - toc()

Hexo의 Helper 중에 [`toc()`](https://hexo.io/ko/docs/helpers#toc)이라는 아이가 있습니다. 파라미터로 사용되는 스트링(블로그 문서)에서 `h1~h6` 태그들을 찾아서 목록을 만들어주죠. 알아서 생성해주니 고맙긴한데, 여기서부터 Bramus 형님의 접근과 방법이 살짝 갈라집니다. 위에 링크된 글 예시에서는 html의 내용이 섹션으로 나눠져있습니다. Hexo의 블로그 포스트는 별로도 섹션을 나눠서 작성하지 않습니다. `toc()`은 헤딩의 이름만 알려주지, 그 밑에 무슨 내용이 있는지, 어디까지가 해당 헤딩의 범주인지.. 이런 정보는 갖고있지 않습니다. 글을 작성할 때마다 섹션을 나눠서 쓸 수 있는지도 의문이고, 귀찮기도 하고요. 저는 그래서 일단은 헤딩만 감지하는 걸로 만들어볼까 합니다.

# Templating

테마 디렉토리 안에 있는 `layout>_partial_post` 에 `toc.ejs`를 만들고 `article.ejs` 레이아웃 파일 최하단에 다음처럼 붙여보겠습니다.

```javascript article.ejs
<% if (!index && !page){ %>
  <%- partial('post/toc') %>
<% } %>
```

...이렇게 `article.ejs` 문서 맨 마지막에 붙여주었습니다. 조건문을 쓴 이유는 article 레이아웃이 지금 index에도 쓰이고 page에서도 쓰이기 때문에 두 경우에는 목차를 보여주지 않기 위해서입니다. `toc.ejs` 파일은 다음처럼 작성했습니다.

```javascript article.ejs
<% if (toc(post.content) !== ""){ %>
  <nav id="article-toc">
    <h2><%- post.title %></h2>
    <%- toc(post.content, {list_number: false, min_depth: 1, max_depth: 3}) %>
    <%- js('js/tocscrollspy') %>
  </nav>
<% } %>
```

조건문은 헤딩조차 없는 아주 짧은 글의 경우에, `toc()`이 아무것도 반환하지 않았을때 목차를 아예 사용하지 않기 위해서구요. 나머지 경우에 nav 안에 `toc()`에 옵션을 추가해서 불렀습니다. [Hexo 공식문서](https://hexo.io/ko/docs/helpers#toc) 에 따르면 옵션은 3가지, class, list_number, max_depth, min_depth 이고 디폴트는 각 'toc', true, 6, 1 입니다.
저는 list_number 와  max_depth 값만 바꿔줬습니다. (숫자 표시 안 하고 h4~h6 소제목은 목차에 포함 안 하기로) 그 밖에 h2로 제목으로 글 제목을 사용하고, 목차 밑에 간단한 스크립트 파일을 추가하겠습니다. 스크립트를 보기전에 잠시 스타일을 다듬을까요.

# CSS

![스탕일링 없는 목차 스크린샷](./screenshot1.png "스탕일링 없는 목차 스크린샷")

기존에 블로그 전반 레이아웃으로 사용하고있는 grid에 저희의 목차를 탑승시킵니다. 별도의 `toc.styl` 파일을 만들지 않고 기존 `style.styl`와 `article.styl`을 수정했습니다.

*스타일 관련 코드들은 순 css를 사용하지 않고 스타일러스를 사용합니다 브라켓이랑 세비콜론등이 안 보여도 내용은 그냥 css와 다를게 없으니 참고하시기 바랍니다*

우선 목차 클릭시 스크롤이 부드럽게 넘어가는 법은 초간단합니다

```styl style.styl
html
  scroll-behavior: smooth
```

끝. 이제 목차 스타일링을 시작합니다.

```styl style.styl
#article-toc
  display: none

  @media screen and (min-width: 768px)
    display: block
    align-self: start
    grid-column: 1 / span 1
    grid-row: 3 / span 1
```

우선 저는 모바일에서는 목차를 사용 안하기로 결정했습니다. 일반적으로는 `display:none` ... 미디어 쿼리를 사용해서 768px 이상의 스크린에서 `#article-toc`을 보여주고, 기존에 있는 그리드 안에서의 위치를 잡아주었습니다. 그리고 중요한 건 이 다음에 `position:sticky`를 더해줄텐데, 그리드 내에서 `align-self:start`를 사용하지가 않으면 컨텐츠의 세로길이가 나머지 그리드의 길이만큼 길어져버려서 sticky가 제대로 작동하지 않으니 그리드 내에 있는 요소를 sticky로 만들고 계시다면 참고하시기 바랍니다.

`style.styl` 에는 우선 그리드 관련 코드만 수정해주고... 나머지는 `article.styl` 에서 다음처럼 추가해주었습니다.

```styl article.styl
#article-toc
  position: sticky
  top: 0
  width: 100%
  padding: 20px 0

  li
    a
      color: #333
      font-weight: 600
      text-decoration: none
      opacity: 0.7
      transition: opacity 200ms

    a:hover
      text-decoration: none
      opacity: 1

  li.active a
    opacity: 1

  li.active
    border-left: 3px solid #001F77
    margin-left: -3px
```

![스탕일링이 추가된 목차 스크린샷](./screenshot4.png "스탕일링이 추가된 목차 스크린샷")

자, 이제 스크립트를 추가할 준비가 된 것 같습니다.

# Javascript

테마 디렉토리에서 `source > js` 에 `tocscrollspy.js` 라는 파일을 만들고 내용은

```javascript tocscrollspy.js
window.addEventListener('DOMContentLoaded', () => {

	const articleBody = document.getElementsByClassName("article-entry")[0];	
	const articleToc = document.getElementById("article-toc");
	const allHeadings = articleToc.querySelectorAll("li.toc-item");

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const headerTitle = entry.target.getAttribute('title');
			const headerTitleParsed = headerTitle.replace(/[`~!@#$%^*()_|+\=?;:,.\{\}\[\]\\\/]/gi, '').replace("&",'amp').replace("<",'-lt').replace(">",'-gt').replace(/\s+/g, '-');
			if (entry.intersectionRatio > 0) {
				[].forEach.call(allHeadings, function(el) {
					el.classList.remove("active");
				});
				console.log(headerTitleParsed);
				const linkSpan = articleToc.querySelector(`li a[href="#${headerTitleParsed}"]`);
				if(linkSpan) linkSpan.closest('li.toc-level-1').classList.add('active');
			}
		});
	});

	articleBody.querySelectorAll('.headerlink').forEach((headerlink) => {
		observer.observe(headerlink);
	});
	
});
```

이렇습니다. 크게 세 구역으로 나눠서 보자면 먼저 제일 처음에는 앞으로 사용할 DOM 노드들을 선택해서 세개의 변수로 잡아주었구요. 중간 부분에서 제일 중요한 IntersectionObserver로 observer를 만들어 주었습니다다. 마지막에는 구역에 있는 코드는 블로그 본문(artilceBody)에서 headerlink라는 클라스 갖고 있는 모든 요소를 선택해서 각 요소를 observer에게 '감시하라' 라고 말하고 있습니다. 여기서 hearlink는 Hexo에서 글을 쓸 떄 h1~h6를 사용하면 각 헤더 바로 뒤에 자동을 붙는 a 태그의 클라스 이름입니다.

처음이랑 마지막 부분은 크게 설명할 필요가 없을 것 같습니다. 중간 부분이 좀 애매하지요. 이럴때는 공식문서를 뒤져봅니다. [모질라의 Inersection Observer API 문서](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 에 따르면,

> The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

( intersection obeserver api 에 대해서 더 자세하게 설명 여기에 )

# 결과

블로그 글을 읽고 계시면 왼쪽에 보이겠지만, 이런 모양이 되었습니다 :

![스타일과 기능이 완성된 목차 스크린샷](./screenshot5.png "스타일과 기능이 완성된 목차 스크린샷")

앞으로 헥소 글을 섹션으로 나눠서 작업하는 방법을 알아내서 Bramus님처럼 내용까지 트레킹 할 수 있는 버전으로 업그레이드 할 수 있으면 좋을 것 같습니다. 당장은 만족.