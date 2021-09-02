/**
 * @description - Объект с информацией об ошибках
 * @description - получить ошибку можно по ее номеру
 * @description - description - описание ошибки
 * @description - у ошибок с динамическими данными поле description отсутствует, что бы получить ошибку необходимо вызвать
 * @description - метод getDescriprion(params) и передать динамические параметры
 *
 * @example - ERROR_CODES[code].description;
 * @example - ERROR_CODES[code].getDescriprion('sde-123-rg-23);
 *
 */
export const ERROR_CODES: any = {
  "0": {
    title: "INTERNAL_SERVER_ERROR",
    description: "Внутренняя ошибка сервиса",
  },
  "1": {
    title: "BAD_REQUEST",
    description: "Невалидный HTTP запрос",
  },
  "2": {
    title: "NOT_FOUND",
    description: "Запрашиваемый ресурс не найден",
  },
  "3": {
    title: "SERVICE_UNAVAILABLE",
    description: "Сервис недоступен",
  },
  "4": {
    title: "UNSUPPORTED_MEDIA_TYPE",
    description: "Неподдерживаемый тип контента",
  },
  "5": {
    title: "METHOD_NOT_ALLOWED",
    description: "Неверный HTTP метод",
  },
  "6": {
    title: "NOT_ACCEPTABLE",
    description: "Неприемлемый тип ответа",
  },
  "7": {
    title: "DECRYPTION_ERROR",
    description: "Ошибка расшифровки",
  },
  "8": {
    title: "DECRYPT_VOTE_DATA_NOT_FOUND",
    description: "Данные по голосованию не найдены",
  },
  "9": {
    title: "JSON_PARSE_EXCEPTION",
    description: "Ошибка чтения json объекта",
  },
  "10": {
    title: "TOKEN_EXPIRED",
    description: "Время жизни токена окончено",
  },
  "11": {
    title: "INVALID_TOKEN",
    description: "Невалидный токен",
  },
  "12": {
    title: "INVALID_TOKEN_SIGNATURE",
    description: "Невалидная подпись токена",
  },
  "13": {
    title: "CANNOT_GENERATE_KEYS",
    description: "Ошибка при генерации ключей RSA",
  },
  "14": {
    title: "WRONG_BIT_COUNT",
    description: "Неверная длина ключа",
  },
  "15": {
    title: "CANNOT_CREATE_PADDED_MESSAGE",
    description: "Ошибка при генерации сообщения для проверки подписи",
  },
  "16": {
    title: "ACCESS_DENIED",
    description: "Доступ запрещен",
  },
  "17": {
    title: "BAD_CREDENTIALS",
    description: "Неверное имя пользователя или пароль",
  },
  "18": {
    title: "ESIA_CLIENT_ERROR",
    description: "Ошибка взаимодействия с ЕСИА",
  },
  "19": {
    title: "ESIA_AUTH_CODE_URL_ERROR",
    description: "Ошибка формирования URL для получения авторизационного кода от ЕСИА",
  },
  "20": {
    title: "ACCOUNT_NOT_CONFIRMED",
    description: "Учетная запись ЕСИА не подтверждена",
  },
  "21": {
    title: "ESIA_SIGNATURE_CREATION_ERROR",
    description: "Ошибка формирования подписи запроса ЕСИА",
  },
  "22": {
    title: "BLIND_SIGN_VERIFICATION_ERROR",
    description: "Ошибка при проверке слепой подписи. Отправка голоса невозможна",
  },
  "23": {
    title: "TOKEN_SIGN_VERIFICATION_ERROR",
    description: "Ошибка верификации подписи токена",
  },
  "24": {
    title: "ESIA_LOGOUT_URL_ERROR",
    description: "Ошибка формирования URL для выхода из ЕСИА",
  },
  "25": {
    title: "USER_HAS_MANY_GROUPS",
    description: "Пользователь состоит более чем в одной группе",
  },
  "26": {
    title: "USER_GROUP_NOT_PRESENT",
    description: "У пользователя не задана группа",
  },
  "27": {
    title: "JSON_SERIALIZATION_ERROR",
    description: "Ошибка сериализации объекта",
  },
  "28": {
    title: "REDIS_DATA_ERROR",
    getDescriprion: (key: string | number): string => `Redis не содержит искомых данных по ключу ${key}`,
  },
  "29": {
    title: "ELECTION_IMPORT_FAILED",
    description: "Невозможно запустить процесс загрузки файла с выборами",
  },
  "30": {
    title: "IMPORT_XML_PROCESS_START_FAILED",
    description: "Невозможно запустить процесс обработки xml",
  },
  "31": {
    title: "UNZIP_ERROR",
    description: "Не удалось распаковать архив",
  },
  "32": {
    title: "IMPORT_XML_COMPLETED",
    description: "Загрузка xml успешно завершена",
  },
  "33": {
    title: "XML_IMPORT_ERROR",
    description: "Импорт xml завершен с ошибкой",
  },
  "34": {
    title: "FILE_SENDING_FAIL",
    description: "Передача файла между сервисами завершена с ошибкой",
  },
  "35": {
    title: "DELETING_FILE_OR_DIRECTORY_ERROR",
    description: "Удаление файла или директории завершена с ошибкой",
  },
  "36": {
    title: "BATCH_JOB_UID_SENDING_ERROR",
    description: "Отправление идентфикатора обработчика пакетника завершена с ошибкой",
  },
  "37": {
    title: "CRYPTO_SERVICE_EXCHANGE_ERROR",
    description: "Ошибка взаимодействия с криптосервисом",
  },
  "38": {
    title: "BLIND_SIGN_PUBLIC_KEY_NOT_FOUND",
    getDescriprion: (id: string | number): string => `Не найден публичный ключ регистратора для голосования с id ${id}`,
  },
  "39": {
    title: "REGISTRY_SERVICE_EXCHANGE_ERROR",
    description: "Ошибка взаимодействия с сервисом регистратором",
  },
  "40": {
    title: "EXCHANGE_ERROR",
    description: "Ошибка вызова внешнего сервиса",
  },
  "41": {
    title: "BLIND_SIGN_KEYS_NOT_FOUND",
    description: "Для данного голосования не сгенерированы публичные ключи слепой подписи",
  },
  "42": {
    title: "IDENTITY_NOT_VERIFIED",
    description: "Личность пользователя не подтверждена",
  },
  "43": {
    title: "SMS_VERIFICATION_NOT_FOUND",
    description: "Отсутствуют данные верификации для указанного голосования и\\или пользователя",
  },
  "44": {
    title: "SMS_VERIFICATION_EXPIRED_TIME_ERROR",
    description: "Истек срок действия кода подтверждения. Попробуйте получить новый",
  },
  "45": {
    title: "SMS_VERIFICATION_CODE_CHECK_ERROR",
    getDescriprion: (seconds: number, isTimer?: boolean): string => {
      const errorText = isTimer
        ? `Не совпадает код подтверждения, запросите новый код через ${seconds} секунд`
        : `Не совпадает код подтверждения. Запросите новый через время, указанное на таймере ниже`;
      return errorText;
    },
  },
  "46": {
    title: "SMS_VERIFICATION_REPEAT_LIMIT_ERROR",
    getDescriprion: (seconds: number): string => `Вы исчерпали количество попыток. Запросите новый код через ${seconds} секунд`,
  },
  "47": {
    title: "PHONE_NUMBER_NOT_PRESENT",
    description: "Номер телефона не задан на госуслугах",
  },
  "48": {
    title: "PHONE_NUMBER_NOT_VERIFIED",
    description: "Мобильный телефон не подтвержден на госуслугах",
  },
  "49": {
    title: "ELECTION_LEVEL_IS_NOT_FILLED",
    description: "Неверно заполнен уровень проведения выборов",
  },
  "50": {
    title: "VOTING_TYPE_IS_NOT_FILLED",
    description: "Неверно заполнен тип голосования",
  },
  "51": {
    title: "BALLOT_MARKS_TYPE_IS_NOT_FILLED",
    description: "Неверно заполнено количество мандатов голосования",
  },
  "52": {
    title: "BALLOT_NATIONAL_LANGUAGE_IS_NOT_FILLED",
    description: "Неверно заполнен национальный язык голосования",
  },
  "53": {
    title: "PROTOCOL_LINE_TYPE_IS_NOT_FILLED",
    description: "Неверно заполнено значение строки при составлении данных о голосовании",
  },
  "54": {
    title: "SOURCE_DATA_FILE_NOT_FOUND_IN_ARCHIVE",
    description: "Файл SourceData.xml не найден в загруженном архиве",
  },
  "55": {
    title: "VOTER_LIST_FILE_NOT_FOUND_IN_ARCHIVE",
    description: "Файл VoterList.xml не найден в загруженном архиве",
  },
  "56": {
    title: "SCHEMA_VALIDATION_ERROR",
    getDescriprion: (schema: string): string => `XML не прошел валидацию по схеме ${schema}`,
  },
  "57": {
    title: "PASSPORT_NOT_FOUND",
    description: "Не найдены серия и номер пасспорта в данных из ЕСИА",
  },
  "58": {
    title: "SNILS_NOT_FOUND",
    description: "Не найдены серия и номер пасспорта в данных из ЕСИА",
  },
  "59": {
    title: "VOTING_ALREADY_COMPLETED",
    getDescriprion: (id: string): string => `Голосование ${id} завершено`,
  },
  "60": {
    title: "VOTING_NOT_YET_STARTED",
    getDescriprion: (id: string): string => `Голосование ${id} не начато. Выдача бюллетеня невозможна`,
  },
  "61": {
    title: "VOTINGS_NOT_FOUND",
    description: "Голосования не найдены для данной избирательной кампании",
  },
  "62": {
    title: "NO_VOTING_RIGHTS",
    getDescriprion: (id: string): string => `У пользователя нет активного избирательного права для голосования ${id}`,
  },
  "63": {
    title: "BALLOT_ALREADY_ISSUED",
    getDescriprion: (id: string): string => `Бюллетень для голосования ${id} был выдан ранее`,
  },
  "64": {
    title: "VOTER_LIST_EXPORT_FAILED",
    description: "Невозможно запустить процесс экспорта списка избирателей",
  },
  "65": {
    title: "VOTER_LIST_EXPORT_STARTED",
    description: "Начат процесс экспорта списка избирателей",
  },
  "66": {
    title: "VOTER_LIST_EXPORT_COMPLETED",
    description: "Экспорт списка избирателей в блокчейн успешно завершен",
  },
  "67": {
    title: "VOTER_LIST_EXPORT_ERROR",
    description: "Экспорт списка избирателей в блокчейн завершен с ошибкой",
  },
  "68": {
    title: "NODE_CLIENT_ERROR",
    description: "Ошибка взаимодействия с нодой БЧ",
  },
  "69": {
    title: "BALLOT_ISSUING_NOT_YET_COMPLETED",
    getDescriprion: (id: string): string => `Для пользователя с id ${id} процесс выдачи бюллетеня уже запущен. Дождитесь окончания процесса`,
  },
  "70": {
    title: "VOTE_ALREADY_MADE",
    description: "Код доступа к бюллетеню уже использовался на этом голосовании",
  },
  "71": {
    title: "VOTING_STOPPED",
    description: "Голосование завершено. Отправка бюллетеня невозможна",
  },
  "72": {
    title: "VOTE_PROCESSING_NOT_YET_COMPLETED",
    getDescriprion: (key: string): string => `Процесс обработки голоса с ключом ${key} уже запущен. Дождитесь окончания процесса`,
  },
  "73": {
    title: "EXTERNAL_SERVICE_CALL_ERROR",
    description: "Ошибка вызова внешнего сервиса",
  },
  "74": {
    title: "EXTERNAL_AUTH_SERVICE_ERROR",
    description: "Ошибка взаимодействия с внешним авторизационным сервисом",
  },
  "75": {
    title: "BLOCK_CHAIN_DATA_SERVICE_ERROR",
    description: "Ошибка взаимодействия с датасервисом БЧ",
  },
  "76": {
    title: "NOT_ALLOWED_STATUS_CHANGE",
    description: "Статусный переход запрещен",
  },
  "77": {
    title: "PUBLIC_FILE_KEY_NOT_PRESENT",
    description: "При переходе статуса необходимо прикрепить файл публичного ключа",
  },
  "78": {
    title: "PRIVATE_FILE_KEY_NOT_PRESENT",
    description: "При переходе статуса необходимо прикрепить файл приватного ключа",
  },
  "79": {
    title: "CONTRACT_ID_DOES_NOT_EXIST",
    description: "ContractId не был присвоен",
  },
  "80": {
    title: "VOTING_NOT_FOUND",
    description: "Голосование не найдено",
  },
  "81": {
    title: "VOTING_STATUS_UPDATE_NO_DATA",
    description: "В ответе от блокчейн нет данных",
  },
  "82": {
    title: "VOTING_STATUS_CHANGE_ERROR",
    getDescriprion: (status: string, id: string): string => `Ошибка перехода со статуса ${status} для голосования ${id}`,
  },
  "83": {
    title: "VOTING_ALREADY_IN_STATUS",
    getDescriprion: (status: string): string => `Голосование уже находится в статусе ${status}`,
  },
  "84": {
    title: "VOTING_STATUS_SEND_REQUEST_ERROR",
    description: "Ошибка отправки запроса смены статуса в блокчейн",
  },
  "85": {
    title: "BLOCK_CHAIN_EVENT_NO_VOTING_IDENTIFIER",
    description: "Нет идентификатора голосования в событии из БЧ",
  },
  "86": {
    title: "BLOCK_CHAIN_EVENT_CANNOT_FIND_VOTING",
    getDescriprion: (id: string): string => `Невозможно получить модель голосования по переданному идентификатору ${id}`,
  },
  "87": {
    title: "BLOCK_CHAIN_EVENT_INVALID_RESULT",
    getDescriprion: (id: string): string => `Некорректный результат выполнения операции ${id}`,
  },
  "88": {
    title: "BLOCK_CHAIN_EVENT_NO_CONTRACT_ID",
    description: "Нет contract id в ответе на запрос создания голосования в блокчейн",
  },
  "89": {
    title: "BLOCK_CHAIN_EVENT_NO_STATUS_FIELD",
    description: "Не передано поле status в событии обновления статуса голосования в блокчейн",
  },
  "90": {
    title: "BLOCK_CHAIN_EVENT_NO_MAIN_KEY_FIELD",
    description: "Не передан main key в событии передачи главного ключа из блокчейн",
  },
  "91": {
    title: "BLOCK_CHAIN_EVENT_NO_RESULTS_FIELD",
    description: "Не переданы результаты в событии получения результатов из блокчейн",
  },
  "92": {
    title: "MAIN_KEY_HAS_NOT_FORMED",
    description: "Ключ шифрования блокчейн еще не сформирован",
  },
  "93": {
    title: "ELECTIONS_NOT_YET_STARTED",
    description: "Голосование еще не начато в блокчейн",
  },
  "94": {
    title: "NO_RESULTS",
    description: "Результаты выборов еще не подсчитаны",
  },
  "95": {
    title: "NO_VOTES_UNIQUE",
    description: "Не данных о числе избирателей, проголосовавших на цифровом избирательном участке",
  },
  "96": {
    title: "NO_VOTES_FAIL",
    description: "Нет данных о числе недействительных электронных бюллетеней",
  },
  "97": {
    title: "NO_STATUS",
    description: "Нет данных о статусе",
  },
  "98": {
    title: "BLOCK_CHAIN_RESULT_FAIL",
    description: "Ошибка при подсчете результатов на блокчейн",
  },
  "99": {
    title: "BLOCK_CHAIN_NOT_READY",
    description: "Блокчейн не готов для загрузки публичного ключа",
  },
  "100": {
    title: "PRIVATE_KEY_NOT_READY",
    description: "Блокчейн не готов для загрузки приватного ключа",
  },
  "101": {
    title: "VOTER_LIST_EXPORT_IN_PROCESS",
    description: "Процесс экспорта списка избирателей в блокчейн еще не завершен",
  },
  "102": {
    title: "RESULTS_CALCULATION_IN_PROCESS",
    description: "Процесс подсчета результатов голосвания еще не завершен",
  },
  "103": {
    title: "VOTING_NOT_ACTIVE",
    description: "Голосование не активировано в блокчейн",
  },
  "104": {
    title: "BLIND_SIGN_MISSING",
    description: "В транзакции с голосом отсутствует слепая подпись",
  },
  "105": {
    title: "SENDER_PUBLIC_KEY_MISSING",
    description: "В транзакции с голосом отсутствует публичный ключ пользователя",
  },
  "106": {
    title: "VOTER_LIST_REPORT_STARTED",
    description: "Начат процесс создания отчета списка избирателей",
  },
  "107": {
    title: "VOTER_LIST_REPORT_FAILED",
    description: "Невозможно запустить процесс создания отчета списка избирателей",
  },
  "108": {
    title: "VOTER_LIST_REPORT_COMPLETED",
    description: "Создание отчета списка избирателей успешно завершено",
  },
  "109": {
    title: "VOTER_LIST_REPORT_ERROR",
    description: "Создание отчета списка избирателей завершено с ошибкой",
  },
  "110": {
    title: "FILE_READ_ERROR",
    description: "Невозможно прочитать файл",
  },
  "111": {
    title: "FILE_UPLOAD_ERROR",
    description: "Невозможно загрузить файл",
  },
  "113": {
    title: "WAVES_SIGNATURE_TRANSACTION_ERROR",
    description: "Ошибка формирования подписи транзакции о факте выдачи слепой подписи",
  },
  "114": {
    title: "WAVES_TRANSACTION_ID_ERROR",
    description: " Ошибка формирования id транзакции о факте выдачи слепой подписи",
  },
};
