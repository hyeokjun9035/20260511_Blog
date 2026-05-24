# Oracle ORA-28001 비밀번호 만료 오류 해결 방법 (password has expired)

- **주제/키워드** : Oracle, ORA-28001, password expired, 계정 만료
- **카테고리** : Oracle
- **난이도** : 초급
- **작성일** : 2026-05-18
- 에러코드 : ORA-28001
- 문제 유형 : DB 계정 비밀번호 만료

## 개요

- 오랜만에 학원에서 진행했던 프로젝트를 실행해보려고 DB에 접속했습니다.
- 하지만 데이터 조회가 정상적으로 되지 않았고, 확인해보니 아래와 같은 Oracle 오류가 발생했습니다..

![large](/Oracle_ORA-28001/a.png)

## ORA-28001 오류 원인

- `ORA-28001` 오류는 Oracle 계정의 비밀번호가 만료되었을 때 발생한다.
- Oracle은 기본적으로 DEFAULT PROFILE 정책을 사용하며, 해당 정책의 PASSWORD_LIFE_TIME 값이 180일로 설정되어 있다.
- 프로젝트를 오랫동안 실행하지 않았기 때문에 계정 비밀번호가 만료되면서 DB 접속이 차단된 상태였다.

## **해결 방법**

- 비밀번호를 새로 변경하거나, 비밀번호 만료 정책을 수정하면 해결할 수 있다.

![large](/Oracle_ORA-28001/b.png)

- 윈도우 시작 메뉴에서 [CMD]를 입력 관리자 권한으로 실행합니다.
- CMD 창에서 아래 명령어 작성하여 인증 없이 Oracle 접속하기

```sql
1. sqlplus /nolog
```

- sysdba 명령어로 최상위 권한 계정 접근하기

```sql
2. conn /as sysdba
```

- 해당 계정 비밀번호 변경하기

```sql
3. alter user [비밀번호 변경할 ID] identified by [새로운 비밀번호];
```

- 위 명령어들을 수행하면 만기된 비밀번호를 변경할 수 있습니다. 하지만 위에서도 말했듯이 Oracle 비밀번호 만료일은 180일 입니다. 만료일 설정을 해제하지 않으면 180일마다 동일한 작업을 반복해야 합니다.
- 비밀번호 변경 이후 이어서 진행하면 됩니다.
- 아래의 Select 명령어 작성!

```sql
4. SELECT * FROM DBA_PROFILES WHERE PROFILE = 'DEFAULT';
```

![large](/Oracle_ORA-28001/c.png)

- 명령어를 작성하여 조회를 하면 만료일이 180일로 설정된 것을 볼 수 있습니다.

![large](/Oracle_ORA-28001/d.png)

- ALTER 명령어로 비밀번호 변경주기 해제하기

```sql
5. ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
```

![large](/Oracle_ORA-28001/e.png)

- 그 다음엔 계정 잠금/만료 상태도 확인해보면 좋습니다.

```sql
6. SELECT USERNAME, ACCOUNT_STATUS FROM DBA_USERS WHERE USERNAME = '[확인할 ID]';
```

- 정상이라면 OPEN이 나옵니다.
- 추가로 SELECT 명령문을 하게되면 비밀번호 만료주기만 나오는게 아니라 여러가지가 조회되는데

```sql
FAILED_LOGIN_ATTEMPTS => 로그인 n번 실패하면 잠금
PASSWORD_LIFE_TIME => 비밀번호 n일 사용 가능
PASSWORD_LOCK_TIME => 잠금되면 n일 후 자동 해제
PASSWORD_GRACE_TIME => 만료 후 n일 유예
PASSWORD_VERIFY_FUNCTION => 비밀번호 규칙 함수 없음
SESSIONS_PER_USER => 동시 접속 제한 없음
```

- 참고하시면 좋습니다!
- ※ 다만 운영 환경에서는 보안상 비밀번호 만료 정책을 완전히 해제하기보다, 적절한 만료 기간을 설정하여 사용하는 것을 권장합니다.

## 해결 결과

- 비밀번호 변경 후 정상적으로 Oracle DB 접속이 가능했고, 프로젝트 데이터 조회도 정상 동작하는 것을 확인했습니다.

![large](/Oracle_ORA-28001/f.png)