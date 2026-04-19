# StatusBar Quotes 리팩토링 제안서

## 구현 상태

Ralph 리팩토링에서 Phase 1~4의 핵심 구조 분리를 적용했다. `Quoter`는 quote 상태와 timer/event 발행에 집중하고, quote 조회/카테고리 매핑/표시 문자열/VS Code UI 어댑터는 별도 모듈로 분리했다. 발견된 초기 상태바 렌더, shuffle 즉시 갱신, category/language 변경 즉시 갱신, deactivate cleanup, display seconds 기본값 불일치도 회귀 테스트와 함께 정리했다.

## 목표와 현재 범위

이번 단계의 목표는 전면 리팩토링 전에 현재 동작을 회귀 테스트로 잠그는 것이다. 프로덕션 코드는 아직 변경하지 않고, 사용자 흐름을 대표하는 테스트와 테스트 실행 안정화만 추가했다.

## 현재 코드베이스 분석

### 핵심 사용자 흐름

1. VS Code가 `onStartupFinished`에서 확장을 활성화한다.
2. `activate()`가 상태바 quote item, shuffle item, 명령, 설정 변경 리스너를 등록한다.
3. 초기 설정(`category`, `language`, `display-seconds`, `display-shuffle-button`)을 읽어 `Quoter`를 생성한다.
4. `Quoter`가 카테고리/언어별 quote 목록을 만들고 임의 quote를 선택한다.
5. 타이머 또는 명령/설정 변경에 따라 상태바 텍스트, tooltip, modal text가 갱신된다.

### 근거 기반 관찰

- `package.json`은 설정 스키마와 명령 팔레트 항목을 제공하지만, 상태바 전용 명령(`show-quote-on-modal`, `shuffle-quotes`)은 `activate()`에서만 등록된다.
- `src/extension.ts`는 UI 생성, 설정 읽기, command handler, configuration listener, `Quoter` 생명주기를 모두 담당한다.
- `src/models/quoter.ts`는 quote repository, category key parsing, random selection, presentation text formatting, timer, VS Code event 발행을 모두 담당한다.
- `Quote`와 `Quotes` 모델은 mutable class이며 값 객체 이상의 책임은 없다.
- 기존 `extension.test.ts`는 샘플 assertion만 있어 실제 사용자 흐름을 보호하지 못했다.

### 현재 리스크

- 초기 quote는 생성자에서 선택되지만 listener 등록 전에 발생하므로 상태바는 첫 tick 전까지 비어 있을 수 있다.
- shuffle command는 `displayRandomQuote()`만 호출하고 change event를 발행하지 않아 상태바 즉시 갱신이 보장되지 않는다.
- `deactivate()`가 timer를 정리하지 않고, `Quoter`도 public stop/dispose API가 없다.
- `package.json`의 display seconds 기본값은 `15`, `constants.DEFAULT_DISPLAY_SECONDS`는 `10`으로 불일치한다.
- 카테고리 export key는 표시 문자열을 정규화한 값에 의존한다. 새 카테고리 추가 시 package manifest, constants, quotes export가 쉽게 어긋날 수 있다.

## 추가한 테스트 세트

테스트는 고전파(classicist) 스타일로 작성했다. 내부 collaborator를 과도하게 mock하지 않고 실제 `Quoter`, 실제 quote fixture, VS Code `EventEmitter`를 함께 실행한다. 비결정적인 quote 선택만 `Math.random`을 짧게 제어해 결과를 안정화했다.

커버한 흐름:

- 모든 지원 카테고리 × 언어 조합에서 quote text, tooltip, modal text 생성
- `All` 카테고리에서 선택 언어의 전체 quote pool 사용 및 원본 카테고리 tooltip 유지
- 카테고리 변경과 언어 변경 후 표시 quote reload
- shuffle 동작이 현재 카테고리/언어 안에서 다른 quote 표시
- `displaySeconds = 1` 타이머 tick 후 quote 변경 및 event 발행
- `displaySeconds = 0`에서 quote는 유지하되 UI 갱신 event는 발행

## 리팩토링 제안

### Phase 0: 안전 기준 유지

- 모든 변경은 `yarn run compile`, `yarn run lint`, `yarn test` 통과 후 다음 단계로 진행한다.
- 새 테스트가 실패하면 리팩토링을 중단하고 테스트가 드러낸 현재 동작/버그를 먼저 분류한다.

### Phase 1: 도메인 로직 분리

- `Quoter`에서 quote loading과 category matching을 분리한다.
- 제안 모듈:
  - `QuoteRepository`: 언어/카테고리별 quote 조회
  - `CategoryRegistry`: 표시명, 설정값, export key를 단일 source of truth로 관리
  - `QuotePresenter`: `quoteText`, `quoteTooltip`, `quoteModalText` 생성
- `Quote`/`Quotes`는 `readonly interface` 또는 `type`으로 단순화한다.

### Phase 2: Quoter를 상태 머신으로 축소

- `Quoter`는 현재 선택 조건, 현재 quote, elapsed seconds, event 발행만 담당하게 한다.
- `start()`에 대응하는 `stop()`/`dispose()`를 추가한다.
- `displayRandomQuote()` 또는 shuffle용 public API가 change event를 발행하도록 명확히 한다. 단, 이 동작 변경 전에는 extension-level 테스트를 먼저 추가한다.

### Phase 3: VS Code 어댑터 정리

- `activate()`에서 UI/설정/명령 등록을 작은 함수로 나눈다.
- `StatusBarQuoteController`를 도입해 status bar item 두 개와 command wiring을 소유하게 한다.
- configuration read/update는 adapter 함수로 모아 validation과 기본값을 한 곳에서 관리한다.

### Phase 4: 설정/manifest 일관성 개선

- `package.json` 설정 enum/default와 TypeScript constants의 중복을 줄인다.
- display seconds 기본값 `10` vs `15` 중 하나를 제품 결정으로 확정하고 테스트에 반영한다.
- category 추가 절차를 한 파일 수정 중심으로 줄인다.

### Phase 5: 테스트 보강

- 현재 Quoter 중심 회귀 테스트에 더해 controller/activation 흐름 테스트를 추가한다.
- 특히 초기 상태바 표시, shuffle 즉시 갱신, deactivate cleanup을 테스트로 잠근 뒤 수정한다.

## 권장 실행 순서

1. Phase 1에서 순수 함수/registry를 도입하되 public output은 변경하지 않는다.
2. 테스트 통과 후 Phase 2에서 timer lifecycle과 event 발행 규칙을 정리한다.
3. Phase 3에서 VS Code API 경계를 얇게 만들고 activation 코드를 단순화한다.
4. Phase 4에서 설정 기본값/카테고리 source of truth를 정리한다.
5. 마지막으로 dead code, typo(`cmdChangeCatrgory`), TODO, 불필요 class를 제거한다.
