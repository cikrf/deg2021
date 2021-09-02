export const convertErrorCodeToErrorMessage = (code: number) => {
  switch (code) {
    case 160:
      return 'Неверный пароль'
    case 162:
      return 'Некорректная длина нового пароля'
    default:
      return 'Неизвестна ошибка'
  }
}
