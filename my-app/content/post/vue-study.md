# 공부

## Vue.js 개발 스타일

Options API

- data, methods, mounted 같은 객체를 활용하여 컴포넌트 로직을 정의하는 개발 스타일
    1. Data 메소드
        1. 해당 컴포넌트에서 사용될 state 즉, 데이터들을 관리해주는 곳
        2. data에서 변환된 속성들은 반응적인 상대가 되어 this에 노출됨
    2. Methods
        1. 속성값을 변경하고 업데이트 할 수 있는 함수이며, 템플릿 내에서 이벤트 핸들러로 바인딩이 가능
        2. methods에서 변환된 함수들은 data에서 반환된 속성과 마찬가지로 this에 노출이 됨
- 옵션으로 정의한 속석은 컴포넌트 인스턴스를 가리키는 함수 내부의 this에 노출됨

Composition API

- import 키워드를 통해서 가져온 Vue.js 내장 API 함수 혹은 속석들을사용하여 컴포넌트 로직을 정의하는 개발 스타일
    1. ref, reactive
        1. 컴포지션 API에서는 반응성 있는 데이터를 만들어줄 경우, ref 혹은 reactive 키워드를 통하여 변수를 선언
        2. const count = ref(0) ⇒ 초기값을 0으로 설정
        const obj = reactive({name:’test’, age:30})
    2. methods
        1. 컴포지션 API에서는 methods라는 객체를 선언할 필요가 없기 때문에 함수를 그냥 만들어 사용하면 됨
        2. function increment(){count.value++} ⇒ ref로 참조한 데이터에 접근 할 경우에는 value로 접근함
- SFC(Single File Component)에서 컴포지션 API는 일반적으로 <scriptsetup> 처럼 사용함