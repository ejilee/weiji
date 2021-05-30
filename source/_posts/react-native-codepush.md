---
title: React Native 앱, 더 손쉽게 관리하기 - CodePush
author: Yeji
tags: [React Native, Deployment, CodePush]
categories:
  - [React Native]
date: 2021-05-24 11:37:46
---

앱을 배포하는 과정은 번거롭다. 얼마전에 이미 배포된 앱을 재배포하지 않고 수정할 수 있느냐의 질문이 들어왔었는데... (이미 앱을 설치한 사용자의 화면에 뭔가 새로운 것을 보여주는 일) 불가하다고 대답할 수 밖에 없었다. 당장 수정해야 되는 정보는 백엔드에서 고치기로 하고, 차후 비슷한 상황을 대비해 CodePush를 도입하기로 했다.

(_잠깐, 만약 당신의 앱이 Expo와 Over the Air 업데이트를 사용하고 있다면, CodePush가 필요없다. Expo가 CodePush 와 유사한 기능을 제공한다._)

## CodePush 란?

CodePush는 마이크로소프트의 AppCenter 서비스의 일부로 Cordova와 React Native 앱의 업데이트를 App Store나 Play Store를 거치지 않고 바로 사용자 기계에 설치된 앱에 푸시할 수 있도록 도와준다. 업데이트할 수 있는 부분은 JS, HTML, CSS, 이미지 에셋 정도이다. 그러니까 왠만한 인터페이스 수정은 가능하나 **SDK를 업데이트하거나 Native 코드를 다루는 패키지를 추가하거나 하게된다면 기존의 방법으로 다시 빌드해서 재배포해야한다.**

공홈 문서를 읽어보자 : [CodePush 소개](https://docs.microsoft.com/ko-kr/appcenter/distribution/codepush/) 그렇다면 이제부터 CodePush 를 도입하는 방법을 단계별로 소개한다.

## AppCenter CLI 설정

AppCenter를 사용하기 위해서 일단 터미널을 켜고 CLI를 설치하고 앱을 등록해보자.

1. CLI 설치
   `npm i -g appcenter-cli`

2. 로그인
   `appcenter login`
   (브라우저가 열리고 이메일 입력, 돌려주는 토큰을 다시 터미널에 입력하는 과정을 밟으면 로그인이 된다)

3. 로그인 된 사용자를 확인하려면 다음 명령을 사용한다.
   `appcenter profile list`

4. 앱센터에 나의 앱 등록
   `appcenter apps create -d myapp-aos -o android -p react-native`
   `appcenter apps create -d myapp-ios -o ios -p react-native`
   -d 옵션에 앱의 이름을 입력한다. 등록하는 앱의 이름은 자유나, 이렇게 ios, android 두 개를 구분해서 등록하도록 한다. (이름은 나중에 수정 가능) -o (os) 옵션에는 해당 os의 이름을, 그리고 -p (platform) 옵션에는 react-native을 사용한다.

5. 이제 다음 명령으로 등록 된 앱을 조회할 수 있다.
   `appcenter apps list`

6. 등록 된 앱에 각 Staging 과 Production 배포 단계 추가
   `appcenter codepush deployment add -a username/myapp-aos Staging`
   `appcenter codepush deployment add -a username/myapp-aos Production`
   `appcenter codepush deployment add -a username/myapp-ios Staging`
   `appcenter codepush deployment add -a username/myapp-ios Production`
   Staging 과 Production 배포 단계도 원하는 이름으로 작명하고 더 추가할 수 있다. 그래도 이 두개는 기본적으로 사용하니 일단 이렇게 사용해보기를 추천.

7. 이제 다음 명령으로 배포 상태를 확인할 수 있다.
   `appcenter codepush deployment list -a username/myapp-aos`
   `appcenter codepush deployment list -a username/myapp-ios`
   아직은 아무것도 없지만 이제 배포를 할 준비가 다 완료되었다.

8. 마지막으로 각 앱의 배포 키를 확인하자.
   `appcenter codepush deployment list -a username/myapp-aos - k`
   `appcenter codepush deployment list -a username/myapp-ios - k`
   여기서 -k 플래그를 사용해서 각 앱의 Staging 과 Production 키를 확인할 수 있다. 이 키는 이제부터 클라이언트 SDK 를 설정할 때 필요하니 잘 저장해두거나 해당 명령을 기억해두자.

9. 추가 팁 - App Center CLI 의 `set-current` 명령을 사용하면 매번 `-a` 플래그를 사용하는 수고를 덜 수 있다.
   `appcenter apps set-current username/myapp-aos`
   위 명령을 실행하면 이전에 `deployment list` 명령을 쓸 때 `-a` 플래그를 생략하고 실행할 수 있다. 하나의 앱에 여러가지 작업을 하려고 할 때 유용하다. 물론 ios 앱으로 바꿔서 조회하려면 다시
   `appcenter apps set-current username/myapp-ios`
   를 써서 지금 관리하고자 하는 앱을 바꿔주면 된다.

이 밖에 추가 CLI 사용법을 원한다면 [공식 문서](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli)를 확인해보자.

## React Native 클라이언트 SDK 설정

이제 App Center는 준비되었고, 앱을 설정할 차례다.

1. 우선 프로젝트 폴더에서 패키지 설치한다.
   `npm install --save react-native-code-push`
2. 앱의 루트 컴포넌트를 감싼다.

   ```javascript
   ...
   import codePush from 'react-native-code-push'
   ...
   export default codePush(App)
   ```

   위 방법은 가장 React Native 코드베이스에 CodePush를 도입하는 방법 중 가장 간단한 방법으로 이 밖에도 다양한 방법이 있으며 업데이트 확인 주기, 설치 방법 (즉시, 팝업, 이벤트 등) 등의 옵션을 설정할 수 있다.

조금 더 정교한 컨트롤을 원한다면 [패키지 문서](https://github.com/microsoft/react-native-code-push#getting-started) 를 확인해보자. 이제부터 iOS 와 Android 설정을 완료하면 배포할 수 있다!

(_혹시 사용하는 React Native 의 버전이 0.60 이하라면 밑에 설명은 무시하고 공홈의 버전별 설명을 참고하기를 바란다. [SDK 설정 문서](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/rn-get-started)_)

### iOS 설정

1. 프로젝트 폴더에서 CocoaPods dependency 설치를 위해 다음 명령을 :
   `cd ios && pod install && cd ..`
2. IDE 를 열어서... ios/myapp/Info.plist 파일에 다음 값을 추가해준다 :

   ```xml
   ...
   <key>CodePushDeploymentKey</key>
   <string>${CODEPUSH_KEY}</string>
   ...
   ```

3. ios/myapp/AppDelegate.m 파일에 import 문을 하나 추가하고 `return [[NSBundle mainBundle]...` 부분을 `return [CodePush bundleURL];` 로 바꿔준다 :

   ```swift
   ...
   #import <CodePush/CodePush.h>
   ...
   return [CodePush bundleURL];
   ...
   ```

4. Xcode 를 열어서... Project > Info > Configurations 에서 + 를 클릭하여 'Duplicate Release Configuration'을 선택하고 새로 복사된 배포 설정의 이름을 'Staging'이라고 수정한다.

   {% asset_img "rn_codepush_ios_1.png" "xcode에서 새로운 배포 설정을 만들어주는 모습" %}

5. Project > Build Settings 에서 + 를 클릭하여 'Add User-Defined Setting'을 선택하고 'MULTI_DEPLOYMENT_CONFIG' 라는 이름을 준다. Release 와 Staging 에 각 다음 값을 준다 :
   Release : `$(BUILD_DIR)/$(CONFIGURATION)$(EFFECTIVE_PLATFORM_NAME)`
   Staging : `$(BUILD_DIR)/Release$(EFFECTIVE_PLATFORM_NAME)`

   {% asset_img "rn_codepush_ios_2.png" "xcode에서 새로운 사용자 설정 값을 추가해주는 모습" %}

   {% asset_img "rn_codepush_ios_3.png" "xcode에서 새로운 사용자 설정 값을 수정하는 모습" %}

6. 다시 Project > Build Settings 에서 + 를 클릭하여 'Add User-Defined Settings'을 선택하고 'CODEPUSH_KEY' 라는 이름을 준다. Release 와 Staging 값에 각 `appcenter codepush deployment list -a username/myapp-ios - k` 명령어로 확인했던 배포 키를 입력한다.

   {% asset_img "rn_codepush_ios_2.png" "xcode에서 새로운 사용자 설정 값을 추가해주는 모습" %}

   {% asset_img "rn_codepush_ios_4.png" "xcode에서 새로운 사용자 설정 값을 수정하는 모습" %}

7. 기존 빌드를 지워주고 (Xcode 에서 Cmd+shft+K) Debug, Staging, Release 모두 다시 잘 빌드되는지 확인한다.

### Android 설정

1. IDE 를 열어서... android/gradle.properties 파일에 다음 값을 추가해준다. `???` 가 있는 부분엔 각 `appcenter codepush deployment list -a username/myapp-aos - k` 로 확인했던 빌드 별 배포키를 입력한다. :

   ```gradle
   ...
   CODEPUSH_DEPLOYMENT_KEY_DEBUG=
   CODEPUSH_DEPLOYMENT_KEY_STAGING=???
   CODEPUSH_DEPLOYMENT_KEY_PRODUCTION=???
   ```

2. android/settings.gradle 파일에 다음 두 줄을 추가한다 :

   ```gradle
   ...
   include ':app', ':react-native-code-push'
   project(':react-native-code-push').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-code-push/android/app')
   ```

3. android/app/src/main/java/com/myapp/MainApplication.java 파일에 import 문을 하나 추가하고, `new ReactNativeHost(this) { ... }` 블럭 안에 다음 코드를 추가한다 :

   ```java
   ...
   import com.microsoft.codepush.react.CodePush;
   ...
   new ReactNativeHost(this) {
        ...
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
      };
   ...
   import com.microsoft.codepush.react.CodePush;
   ...
   ```

4. android/app/build.gradle 파일에 다음 줄을 추가하고 :

   ```java
   ...
   apply from: "../../node_modules/react-native/react.gradle"
   apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"
   ...
   ```

   (android/app/build.gradle) `buildTypes { ... }` 블럭 안에 각 빌드 마다 `resValue` 라는 값을 추가한다. (releaseStaging은 아래처럼 새로 추가해준다) :

   ```java
   buildTypes {
      debug {
         ...
         resValue "string", "CodePushDeploymentKey", CODEPUSH_DEPLOYMENT_KEY_DEBUG
      }
      release {
         ...
         resValue "string", "CodePushDeploymentKey", CODEPUSH_DEPLOYMENT_KEY_PRODUCTION
      }
      releaseStaging {
         initWith release
         resValue "string", "CodePushDeploymentKey", CODEPUSH_DEPLOYMENT_KEY_STAGING
         matchingFallbacks = ['release']
      }
   }
   ```

   (android/app/build.gradle) 에 `if(enableHermes) { ... }` 블락이 있다면 아래도 내용도 추가해줘야 한다 :

   ```gradle
   ...
   if (enableHermes) {
    ...
    releaseStagingImplementation files(hermesPath + "hermes-release.aar")
   }
   ...
   ```

5. 휴! 안드로이드 역시 기존 빌드를 지워주고 (`cd android && ./gradlew clean`) debug, releaseStaging, release 모드 잘 빌드되는지 확인하자. (`./gradlew bundleReleaseStaging`...)

## 배포

모두 잘 빌드되고 애뮬레이터든 기기에서든 돌려보고 확인했다면 앞으로 코드푸시를 활용할 일만 남았다. 혹시 위 내용을 따라했는데 빌드 에러가 난다거나 뭐가 안 된다면 다시한번 공홈을 뒤져보거나 구글 검색을 해보자. 나도 공홈 내용만 고대로 따라했다가 안드로이드에서 staging apk가 실행되지 않는 오류를 겪었는데, 디버깅을 하며 검색한 후 다음 [스택오버플로우](https://stackoverflow.com/questions/56734877/getting-library-libjsc-so-not-found-after-upgrading-react-native-to-0-60-rc2/60341009#60341009) 글을 통해 위에 Android 설정 마지막 단계에 맨션된 Hermes 관련 코드를 추가해야 된다는 걸 배웠다.

처음에 AppCenter에 앱을 등록하고 배포를 설정 할 때 Staging 과 Production, 두 개의 빌드 단계를 추가했었다. 이는 다음 같은 CodePush 배포 플로우를 활용하기 위함이다. :

1. Debug 모드에서 개발, 변경 사항 수정
2. Staging 빌드로 우선 배포
3. Staging 빌드가 설치된 기기에서 내부 테스팅
4. Staging 테스팅 완료 후 Staging 배포 내용을 Production (release) 로 promote (승급) 시킴
5. 배포 완료 (Production 빌드가 설치된 기기에서 또 테스팅)

CodePush 로 업데이트 할 수 있는 영역이 제한되어있기 때문에 이렇게 실 사용자에게 푸시하기 전에 버그를 캐치할 수 있는 배포 과정은 필수적으로 도입해야 할 것 같다. 일단 코드가 잘 푸시되는지 확인하기 위해서... (ios로 테스트 해보겠음) Xcode 'Edit Scheme...' 설정에서 Build Configuration 을 새로 만든 'Staging'으로 변경한 후 기존에 디버깅하던 기기에 있는 앱을 지우고 다시 설치하거나 새로운 기기/애뮬레이터에 Staging 빌드를 설치한다. 해당 빌드가 잘 작동하는지 확인한다.

1. 그럼 테스트를 해보기 위해 이전에 설치한 Staging 빌드에 없는 수정을 코드에 반영해본다. (첫 화면 글씨를 수정한다던가 등등..) AppCenter CLI 를 통해서 배포해보자.

2. ios Staging 빌드를 테스팅한다고 하면 다음 명령을 통해 배포할 수 있다.
   `appcenter codepush release-react -a username/myapp-ios -d Staging`
   `release-react` 말고도 `release` 라는 명령을 사용할 수 있는데, 조금 더 플렉시블 하지만 `release-react` 명령어는 번들링도 같이 해주기 때문에 더 편하다.

3. 그렇다면 1번 단계 전에 Staging 빌드를 설치했던 기기에서 앱을 켜본다. 이 상태에서 다음 CLI 를 사용하면 :
   `appcenter codepush deployment list -a username/myapp-ios`
   처음 CLI 설치 단계에서 없던 새로운 배포 내용이 Staging 빌드 옆에 보이고 설치 내역에 1개의 Pending 이 보인다. 방금 앱을 연 기기에서 업데이트를 받는 중이라는 뜻. 앱을 껐다 다시 켜보자. 변경 사항이 잘 반영되었다면 코드 푸시 성공! 다시 list CLI 를 사용해서 조회해보면 이제 installed 개수가 1로 변경되었을 것이다.

4. 이런 식으로 Staging 빌드로 변경 내용들을 검토하고 실제 앱스토어를 통해서 배포된 앱에 변경 내용을 반영할 지, 아니면 수정을 더 하거나 배포하지 않을지를 정하면 된다. 실제 배포 버전에 반영할 준비가 되었다면 마지막으로 Staging 빌드에 푸시를 한 번 하고 다음 명령어를 사용한다 :
   `appcenter codepush promote -a username/myapp-ios -s Staging -d Production`
   -s (source) 파라미터에 지정해준 빌드를 -d (destination) 파라미터로 지정해준 빌드로 승급시킨다.

5. 실전에선 이미 앱스토어를 통해서 배포된 앱을 설치한 사용자의 기기로 테스트를 해보면 되겠지만 일단은 Staging 빌드를 테스트했던 것과 마찬가지로 기기에 기존에 깔려있던 앱의 빌드를 지우고 Release 빌드 Configuration 을 설치한 기기에서 마지막으로 테스트를 해보고 변경 내용이 잘 나오는지 확인한다. 다시한번 list CLI 를 사용하면 이제는 Production 배포 내역에도 새로운 설치가 추가된 것이 보일 것이다.

...이렇게 설명을 위해서 최대한 간소화한 예시를 설명했는데, [공식 문서](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/cli#app-management)를 참고하면 배포할 때 퍼센티지 rollout, target binary version 등을 설정할 수도 있고, 배포 내역을 rollback 하거나 배포 기록을 지우는 등 더 다양한 명령어가 자세하게 설명되어있다.

CodePush 에 대한 설명은 이쯤 마무리한다. 글을 쓰는 도중 Firebase Remote Config라는 것도 도입하게 되었는데, CodePush 보다는 조금더 간단한 key,value pair를 클라우드에 저장해두고 앱의 배포없이 업데이트 할 수 있게끔 해주는 도구이다. 해당 프로젝트에 Firebase를 이미 사용하고 있어서 손쉽게 설정 할 수 있었다. CodePush에 비하면 훨씬 더 간단하니 (특히 이미 @react-native-firebase/app을 쓰고있다면...) 단순한 솔루션이 필요하다면 고려해보자.
