//관리자의 기능별 접근권한을 다루는 enum
/**
 * [관리자 권한] 1: 관리자, 2: 회원, 3: 이벤트, 4: 펀드 보가권한, 5: 펀드 등록,수정, 6: 펀드 계좌개설(펀드승인) , 종합계좌, 7: 블록딜,8: 문의, 9: PB
 */
export enum ADMIN_ROLE {
  // ALL = 0, //(테스트용)
  ADMIN = 1, //관리자관리
  USER = 2, //회원관리,
  EVENT = 3, //이벤트 관리
  FUND_VIEW = 4, //펀드 보기 권한
  FUND_REGISTER = 5, //펀드 등록, 수정
  APPROVE_ACCOUNT = 6, //펀드 계좌개설(펀드승인) , 종합계좌
  BLOCKDEAL = 7, //블록딜
  QUESTION = 8, //문의
  PB = 9, //PB
  NOTICE_VIEW = 10, //공지사항 보기
  NOTICE_REGISTER = 11, //공지사항 등록 , 수정 ,삭제 권한

  // NOTIFICATION = 4, //알림 기능 접근권한
  // STATISTICS = 5, //통계기능 접근권한
}

export enum ROLE_ACCESS {
  TRUE = '1',
  FALSE = '0',
}
