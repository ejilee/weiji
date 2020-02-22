---
title: TOC 목차 만들기
author: "Weiji"
tags: [ Hexo, CSS, JavaScript, TOC, 목차, Inersection Observer ]
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
다른 헥소 테마에 글 목차 기능이 있는 걸 보았는데,
제대로 작동하지 않고 코드가 잘 정리되어있지 않아서...
기본 landscape 테마를 수정한 후에 목차는 마지막에 별도로 추가하게 되었는데요.

제가 만들어 볼 목차는 :
- 글 왼쪽으로 sticky 하게 붙어있어야 한다.
- 현재 보고 있는 헤딩이 목차 내에서 강조된다.
- 목차 안에서 제목을 클릭하면 해당 내용으로 부드럽게 스크롤링.

마침 최근에 관련된 글을 읽어서 응용해볼까 합니다.

## 참고 블로그 글

Bramus님이 깔끔하게 정리해주신 글입니다 : (영문)
[Smooth Scrolling Sticky ScrollSpy Navigation](https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation)

# Template

## Hexo Helper - toc()

Hexo의 Helper 중에 [`toc()`](https://hexo.io/ko/docs/helpers#toc)이라는 아이가 있습니다. 파라미터로 사용되는 스트링(블로그 글 본문)에서 `h1~h6` 태그들을 찾아서 목록을 만들어주죠. 여기서부터 Bramus 형님의 접근과는 방법이 살짝 갈라집니다. 위에 링크된 글 예시에서는 html의 내용이 섹션으로 나눠져있습니다. Hexo의 블로그 포스트는 별로도 섹션을 나눠서 작성하지 않습니다. `toc()`은 헤딩의 이름만 알려주지, 그 밑에 무슨 내용이 있는지, 어디까지가 해당 헤딩의 범주인지.. 이런 정보는 갖고있지 않습니다. 글을 작성할 때마다 섹션을 나눠서 쓸 수 있는지도 의문이고, 귀찮기도 하고요. 저는 그래서 일단은 헤딩만 감지하는 걸로 만들어볼까 합니다.

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
    <%- toc(post.content, {list_number: false, max_depth: 3}) %>
    <%- js('js/tocscrollspy') %>
  </nav>
<% } %>
```

여기서의 조건문은 헤딩조차 없는 아주 짧은 글의 경우에, `toc()`이 아무것도 반환하지 않았을때 목차를 아예 사용하지 않기 위해서고요. 나머지 경우에 nav 안에 `toc()`에 옵션을 추가해서 불렀습니다. [Hexo 공식문서](https://hexo.io/ko/docs/helpers#toc) 에 따르면 옵션은 3가지, class, list_number, max_depth, min_depth 이고 디폴트는 각 'toc', true, 6, 1 입니다. 저는 list_number 와  max_depth 값만 바꿔줬습니다. (숫자 표시 안 하고 h4~h6 소제목은 목차에 포함 안 하기로) 그 밖에 h2로 제목으로 글 제목을 사용하고, 목차 밑에 간단한 스크립트 파일을 추가하겠습니다. 스크립트를 보기전에 잠시 스타일을 다듬을까요.

# CSS

{% asset_img "screenshot1.png" "스타일링 없는 목차 스크린샷" %}

*스타일 관련 코드들은 순 css를 사용하지 않고 스타일러스를 사용합니다.*
*브라켓이랑 세비콜론등이 안 보여도 내용은 그냥 css와 다를게 없으니 참고하시기 바랍니다*

기존에 블로그 전반 레이아웃으로 사용하고있는 grid에 저희의 목차를 탑승시킵니다. (그리드 컨테이너 관련 내용은 생략하겠습니다) 별도의 `toc.styl` 파일을 만들지 않고 기존 `style.styl`와 `article.styl`을 수정했습니다. 우선 목차 클릭시 스크롤이 부드럽게 넘어가는 법은 초간단합니다.

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

우선 저는 모바일에서는 목차를 사용하지 않기로 했습니다. 그래서 일반적으로는 `display:none` ... 미디어 쿼리를 사용해서 768px 이상의 스크린에서만 `#article-toc`을 보여주고, 기존에 있는 그리드 안에서의 위치를 잡아주었습니다. 이 과정에서 기억할 건 그리드 내 요소에 `align-self:start`를 사용하지 않으면 컨텐츠의 세로길이가 나머지 그리드의 길이만큼 길어져버려서 `position:sticky`가 제대로 작동하지 않는다는 점입니다.

`style.styl` 에는 우선 그리드와 미디어 쿼리 관련 코드만 수정해주고... 나머지는 `article.styl` 에서 다음처럼 추가해주었습니다.

```styl article.styl
#article-toc
  position: sticky
  top: 0
  padding-top: 24px

  h2
    @extend $block-caption
    color: color-accent
    margin-bottom: 24px

  li
    letter-spacing: 1px

    ol.toc-child
      margin-left : 16px

    a
      display:block
      padding: 8px 0 8px 16px
      color: #333
      font-weight: 600
      text-decoration: none
      opacity: 0.8
      transition: opacity 200ms

    a:hover
      opacity: 1

  li.active > a
    opacity: 1
    border-left: 4px solid color-accent
    margin-left: -4px
```

&nbsp;

{% asset_img "screenshot4.png" "스타일링 추가된 목차 스크린샷" %}

이로소 li.active 에 관련된 스타일을 만들어 주었습니다. 이제 스크립트를 사용해서 화면에 보이는 헤딩 요소와 일치하는 목차 제목에 active 클라스를 부여해주면 될 것 같습니다.

# JavaScript

테마 디렉토리에서 `source > js` 에 `tocscrollspy.js` 라는 파일을 만들고 Bramus님의 예시를 참고해서 다음처럼 작성했습니다 :

```javascript tocscrollspy.js
window.addEventListener('DOMContentLoaded', () => {

	const articleBody = document.getElementsByClassName("article-entry")[0];	
	const articleToc = document.getElementById("article-toc");
	const allTocLis = articleToc.querySelectorAll("li.toc-item");

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {

			const headerTitle = entry.target.getAttribute('title');
			const headerTitleFixed = headerTitle.replace(/[`~!@#$%^*()_|+\=?;:,.\{\}\[\]\\\/]/gi, '').replace("&",'amp').replace("<",'-lt').replace(">",'-gt').replace(/\s+/g, '-').replace('---','-');
			
			if (entry.intersectionRatio > 0) {
				allTocLis.forEach(el => { el.classList.remove("active"); });
				articleToc.querySelector(`li a[href="#${headerTitleFixed}"]`).parentElement.classList.add('active');
			}

		});
	},{rootMargin:'-60px'});

	articleBody.querySelectorAll('.headerlink').forEach((headerlink) => {
		observer.observe(headerlink);
	});
	
});
```

'DOMContentLoaded' 이벤트 리스너 안의 내용을 크게 세 구간으로 나눠보자면...
- 처음에는 앞으로 사용할 DOM 노드들을 선택해서 세개의 변수로 잡아주었습니다.
- 중간 부분에서 제일 중요한 new IntersectionObserver로 observer를 만들어 주었습니다다.
- 마지막에는 구역에 있는 코드는 블로그 본문(articleBody)에서 headerlink라는 클라스 갖고 있는 모든 요소를 선택해서 각 요소를 observer에게 '감시하라' 라고 말하고 있습니다.

여기서 headerlink는 Hexo 마크다운에서 h1~h6를 사용하면 각 헤더 바로 뒤에 자동을 붙는 a 태그의 클라스 이름입니다. 저희는 이 a.headerlink 들을 '감시'해서 특정 a.headerlink 요소가 화면에 등장 할 때마다 목차에 변화를 줄 것입니다. 우선 IntersectionObserver 가 뭐하는 녀석인지 짚고 넘어가야 해당 기능을 사용할 수 있을 것 같습니다.

## Intersection Observer API

[모질라의 Intersection Observer API 문서](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 에 따르면,

> The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

번역을 하면,
> 'Intersection Obeserver API'는 **대상 요소**와 **조상 요소** (선조 요소?? 혹은 최상단 뷰포트 요소)의 **교차점의 변화**를 비동기적으로 지켜보는 방법을 제공합니다.

말이 좀 어려워서 그렇지 가장 많이 사용되는 예시로 뷰포트에 대상 요소가 나타나는 걸 감지할 때 쓰입니다. 예를 들어 스크롤을 해서 화면에 이미지가 나타날 때 레이지하게 이미지를 로딩하거나, 밑으로 스크롤을 내릴 수록 추가 요소를 계속 로딩하고 (무한 스크롤), 광고의 화면 가시성을 측정하고, 유저에게 보이느냐 안보이느냐에 따라 복잡한 에니메이션을 실행할지 중단할지 등을 정할 때 쓰일 수 있습니다.

옛날 같았으면... jQuery 로 요소의 수직 위치 알아내서 하나하나 뭐하고 뭐하고 했을텐데, Intersection Observer로 훨씬 더 간편하고 깔끔하게 처리할 수 있습니다. 모질라 문서를 읽어본 후 몇 가지 요점을 정리해 봤습니다. (ie 호환 안 되니, 해당 문서에서 브라우저 호환성도 확인하시고 사용하시길 권장드립니다)

Intersection Observer API 사용시 기억할 부분들 :
- 우선 Intersection Observer의 컨스트럭터를 불러서 새 intersection observer 를 생성합니다.
- 파라미터는 2개, 콜백 함수와 옵션 객체
- 콜백함수 / 대상 요소와 조상 요소의 교차점에 변화가 오면 부르는 함수
- 옵션은 3가지 / root, rootMargin, threshold.
- root : 사용할 조상 요소. 따로 안 잡아주거나 null 이면 뷰포트.
- rootMargin : 조상 요소의 마진. 일반 css 마진처럼 잡아줄 수 있음. (예 - rootMargin : '12px 6px 12px 0') 기본값 0.
- threshold :  0.0 ~ 1.0 의 숫자. 조상 요소와 교차하는 대상요소의 비율을 나타냄. 해당 비율을 지날 때 콜백함수가 불려짐. 배열로 한계점 여러개 잡을 수 있음. (예 - threshold : [0.2, 0.4, 0.6, 0.8, 1.0] ) 기본값 0 (대상 요소가 쬐끔이라도 보이면 콜백부름. 1.0으로 설정 시 대상요소가 100% 보이면 콜백 부른다는 의미.
- 콜백 함수는 [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 객체 배열과 (위에서 말한 threshold 한계점 하나당 하나의 객체) observer를 전달받음
- 각 IntersectionObserverEntry 객체는 대상 요소가 조상 요소와 교차하는 비율 (threshold), 교차하고 있는지 아닌지의 여부, 그리고 어떤 방향으로 변화가 일어나고있는지 (나타나고 있는지, 없어지고 있는지) 의 정보를 가지고 있음.
- 교차점의 변화를 감지하는 것은 비동기 작업이지만, 콜백 자체는 비동기가 아닌 main thread 에서 실행됨. 너무 무거운 작업은 Window.requestIdleCallback() 사용 권장

저는 일단 당장 사용할 때 주의해야할 기본 사항들을 정리해 보았고요, 모질라 문서에는 교차영역이 어떻게 계산되는지 같은 자세한 얘기과 예시도 두개나 들어있으니, 더 자세한 내용이 필요하시면 꼭 읽어보시길.

그럼 글 초반에 링크 걸었던 [블로그 글](https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/)에는 어떻게 사용되고 있나 확인해보겠습니다.


```javascript 링크된 글에 사용된 코드
window.addEventListener('DOMContentLoaded', () => {

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			const id = entry.target.getAttribute('id');
			if (entry.intersectionRatio > 0) {
				document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
			} else {
				document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active');
			}
		});
	});

	// Track all sections that have an `id` applied
	document.querySelectorAll('section[id]').forEach((section) => {
		observer.observe(section);
	});
	
});
```

const observer = new IntersectionObserver(); 안에 있는 내용을 확인해야겠죠. 여기는 옵션은 사용하지 않았네요, 콜백 함수... entries => {} 의 내용만 보면 될 것 같습니다. 이 경우에는 threshold 옵션을 사용하지 않아서 콜백 함수에 전달되는 entry 는 하나겠죠..? 그래도 forEach를 사용해서 이렇게 써놓으면 나중에 threshold 갯수를 수정할 때 편하겠고, 또 entries[0] 이렇게 제한해서 명시하지 않아도 되는 그런 이유로 forEach가 있는 것 같습니다. (내 해석이 틀린 거면 누가 좀 알려죠요..)

그래서 forEach 안에 내용을 보자면... intersectionObserverEntry의 속성 두 가지가 보입니다... entry.target, entry.intersectionRatio. target은 대상 요소, intersectionRatio 는 교차 비율입니다. 참고해서 읽으면
- id는 대상 요소의 id 값이다.
- 대상 요소의 교차 비율이 0보다 크면...
- 문서에서 href값으로 id를 사용하고 있는 nav 속 li 속 a 태그를 찾아서
- 그 태그의 부모요소의 클라스 목록에 'active'를 더해라
- 대상 요소의 교차 비울이 0보다 크지 않으면...
- 문서에서 href값으로 id를 사용하고 있는 nav 속 li 속 a 태그를 찾아서
- 그 태그의 부모요소의 클라스 목록에 'active'를 삭제해라
입니다.

아까 Template 부분에서 말했듯이, 이 예시에서는 id값을 가진 section를 관찰하죠. 해당 section이 조금이라도 보이면 목차에 같은 id값을 가진 a 태그가 강조됩니다. 관련 내용을 다 읽고 해딩과 글 내용까지 포함한 section이 아예 보이지 않게 될 때 비로소 목차에서 강조 스타일이 없어지곘죠.

제 경우에 이걸 바로 똑같이 쓰지 못하는 이유는... 저는 해딩 태그만 관찰하기 때문이죠. 만약에 콜백을 저렇게 썼다면... 해딩이 보이지 않는 즉시 목차에 강조 스타일이 사라질 겁니다. 헤딩 아래에 관련 내용은 아직도 길게 늘어져있는데 말이죠.

일단 IntersectionObserver 옵션으로 root와 threshold는 저도 기본값인 뷰포트와 0으로 두고, rootMargin만 조금 깎았습니다.

```javascript tocscrollspy.js
window.addEventListener('DOMContentLoaded', () => {

	const articleBody = document.getElementsByClassName("article-entry")[0];	
	const articleToc = document.getElementById("article-toc");
	const allHeadings = articleToc.querySelectorAll("li.toc-item");

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {

                    // 여기에 무슨 내용이...

		});
	},{rootMargin:'-60px'});

	articleBody.querySelectorAll('.headerlink').forEach((headerlink) => {
		observer.observe(headerlink);
	});
	
});
```

일단 여기까지 쓰고 여기서 forEach 안에 어떤 내용을 집어넣어야 할까... 고민을 하다가.
콜백을 불렀을 시 우선 목차에 있는 모든 li에서 active 클라스를 없애고, 대상 요소의 title 과 일치하는 href 값을 가진 a의 부모 li에만 active 클라스를 추가했습니다. 이렇게 하면 페이지 위에서 아래로 읽을 때는 왠만하면 내용이 목차에 잘 반영됩니다. 특정 해딩을 먼저 읽고 > 목차에서 해당 해딩을 강조해주고 > 해딩 아래에 있는 관련 내용을 읽으면서 (아직도 해당 해딩이 강조되어있고) > 다 읽고 다음 해딩이 나올 쯤에 > 이전 해딩의 강조가 없어지고 다음 해딩이 강조되죠. 코드도 복잡하지 않죠 :

```javascript forEach 안에 들어갈 내용
const headerTitle = entry.target.getAttribute('title');

if (entry.intersectionRatio > 0) {
  allTocLis.forEach(el => { el.classList.remove("active"); });
  articleToc.querySelector(`li a[href="#${headerTitle}"]`).parentElement.classList.add('active');
}
```

이제.. 문제는 아래에서 위로 읽었을 시에... 독자의 페이지 위치가 목차에 제때 반영되지 않는다는 점입니다. 또 콜백을 부를 때마다 모든 active 클라스를 없애기 때문에 여러 해딩이 다닥다닥 붙어있는 부분에서는 목차에서 여러개를 강조하지 못하고 그 중 한개만 강조한다는 점... 만약에 아래서부터 위로 읽는 버릇을 가진 독자는 어서 나쁜 버릇을 고치셔야...가 아니라. 헥소 글을 section으로 나눠서 작성하는 방안을 찾아보겠습니다. 다음 기회에.

추가로 headerTitle을 가져왔을 때 바로 a href 값과 비교하면, toc()이 만들어주는 href 문자열 값이 변경되어 사용되기 때문에 일치하지 않을 수도 있습니다. 여기에 대해서는 일단 해딩 스트링에 사용할 법한 특수기호들을 없애주고 띄어쓰기를 '-'로 바꿔주도록 replace 를 몇번 써서 headerTitleFixed 라는 값을 별도로 만들어서 썼습니다. 이렇게요 :

```javascript title 문자열 변환
const headerTitle = entry.target.getAttribute('title');
const headerTitleFixed = headerTitle.replace(/[`~!@#$%^*()_|+\=?;:,.\{\}\[\]\\\/]/gi, '').replace("&",'amp').replace("<",'-lt').replace(">",'-gt').replace(/\s+/g, '-').replace('---','-');

if (entry.intersectionRatio > 0) {
  allTocLis.forEach(el => { el.classList.remove("active"); });
  articleToc.querySelector(`li a[href="#${headerTitleFixed}"]`).parentElement.classList.add('active');
}
```

다시 tocscrollspy.js 의 내용 전부 정리하자면 이렇습니다 :

```javascript tocscrollspy.js
window.addEventListener('DOMContentLoaded', () => {

	const articleBody = document.getElementsByClassName("article-entry")[0];	
	const articleToc = document.getElementById("article-toc");
	const allTocLis = articleToc.querySelectorAll("li.toc-item");

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {

			const headerTitle = entry.target.getAttribute('title');
			const headerTitleFixed = headerTitle.replace(/[`~!@#$%^*()_|+\=?;:,.\{\}\[\]\\\/]/gi, '').replace("&",'amp').replace("<",'-lt').replace(">",'-gt').replace(/\s+/g, '-').replace('---','-');
			
			if (entry.intersectionRatio > 0) {
				allTocLis.forEach(el => { el.classList.remove("active"); });
				articleToc.querySelector(`li a[href="#${headerTitleFixed}"]`).parentElement.classList.add('active');
			}

		});
	},{rootMargin:'-60px'});

	articleBody.querySelectorAll('.headerlink').forEach((headerlink) => {
		observer.observe(headerlink);
	});
	
});
```

# 결과

{% asset_img "screenshot5.png" "스타일과 기능이 완성된 목차 스크린샷" %}

부족한 부분이 많지만, 당분간 사용하기엔 나쁘지 않은 것 같습니다.
앞으로 마크다운 글을 섹션으로 나눠서 작업하는 방법을 찾아서
내용까지 트레킹 할 수 있는 버전으로 업그레이드 할 수 있으면 좋을 것 같습니다.

*약 이 글을 밑에서부터 위로 읽으신다면 미리 양해를 구합니다...*