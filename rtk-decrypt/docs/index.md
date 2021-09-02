# RTK Decrypt service documentation

## Сервис состоит из модулей:

- [Auth module](#auth-module)
- [Blockchain module](#blockchain-module)
- [Counter module](#counter-module)
- [Crypto module](#crypto-module)
- [GRPC Module](#grpc-module)
- [Master module](#master-module)
- [RabbitMQ module](amqp-documentation/AMQP.md)

## Event bus

Так же есть шина событий event-bus через которую общаются модули grpc, blockchain, counter и позволяет избежать сильной
связанности

Типы событий:

- blockReceived - выпускается модулем grpc, содержит данные блока и транзакций
- notFound - выпускается модулем grpc,
- rollback - выпускается модулем grpc, содержит подпись блока, до которого произошел роллбек,
- blockParsed - выпускается модулем blockchain, после обработки блока с транзакциями,
- pauseSync - выпускается модулем blockchain, когда требуется остановка стрима
- resumeSync - выпускается модулем blockchain, когда требуется возобновить стрим,
- startSync - выпускается модулем blockchain, когда требуется начать стрим с определенной высоты
- synced - не используется
- syncing - не используется

## Схема бд

### Block entity
- height: int4 -- primary key
- signature: bytea
- created_at: timestamp

### Master entity
- id: varchar -- primary key
- contract_id: bytea
- poll_id: varchar
- status: varchar
- public_key: bytea
- private_key: bytea
- created_at: timestamp
- updated_at: timestamp

### Tx entity
- index: int4 -- primary key
- height: int4 -- btree index
- contract_id: bytea
- operation: varchar
- sender_public_key: bytea -- btree index
- tx_id: bytea
- params: json
- diff: json
- ts: timestamptz -- btree index

+ [contract_id, operation] -- btree index

### Vote entity
- index: int4 -- primary key
- height: int4 -- btree index
- contract_id: bytea -- btree index
- sender_public_key: bytea -- btree index
- ts: timestamptz -- btree index
- failed: bool
- valid: bool
- processed: bool -- partial btree index "NOT processed"
- tx_id: bytea
- vote: bytea

---

## Auth module

Позволяет работать с нодой, если установлена авторизация Параметры окружения:

- ```API_KEY``` - api-key ноды
- ```AUTH_SERVICE_ADDRESS``` - адрес сервиса авторизации
- ```AUTH_SERVICE_TOKEN``` - токен сервиса авторизации

Если указан ```API_KEY```, то модуль использует для авторизации api-key ноды\
Если указан ```AUTH_SERVICE_ADDRESS``` и ```AUTH_SERVICE_TOKEN```, то модуль получает jwt-токен в сервисе авторизации и
работает с ним.\
В иных случаях модуль работает без авторизации.

Auth module экспортирует устаревшую зависимость authorized-fetch, который использовалась для запросов к ноде по rest.

---

## Blockchain module

Работает с базой хранящей информацию о блокчейне, блоки и транзацкии, бюллетени\
На старте подписывается ```blockReceived```, ```notFound```, ```rollback```, ```connected``` и находит подпись
последнего сохранненого блок в базе, либо берет из переменной ```DEV_START_FROM_BLOCK``` подпись блока эмитит
событие ```startSync```

### Обработка событий

#### При получении события ```blockReceived```:

- эмит ```pauseSync```
- фильтрует ```103``` и ```104``` транзакции по полю operation
    - транзакция с operation из списка ```createContract``` (103-я), ```addMainKey```, ```startVoting```
      , ```finishVoting```, ```decryption```, ```commissionDecryption```, ```results``` сохраняется в таблицу ```tx```
    - транзакция с operation ```vote```
        - если имеет ключ ```FAIL_```, то устанавливаются флаги ```failed: true```, ```processed: true```
          , ```valid: false```,\
          что позволяет не обрабатывать ее и учесть в подробной статистике
        - в противном случае эти флаги заданы по умолчанию: ```failed: false```, ```processed: false```
          , ```valid: undefined```\
          и транзакция будет обработана в общем порядке
    - другие типы operation ингорируются
- другие типы транзакций игнорируются
- данные сохраняются в базу
- эмит ```blockParsed```
- эмит ```resumeSync```

#### При получении события ```notFound```:

- удаляется последний блок
- удаляются все транзакции и бюллетени с этой высоты
- эмитится событие startSync с предыдущего блока, либо с genesisBlock

#### При получении события ```rollback```:

- удаляются все блоки с указанной высоты
- удаляются все транзакции и бюллетени с указанной высоты
- эмитится событие startSync с предыдущего блока, либо с genesisBlock

#### При получении события ```connected``` (возникает в случае реконнекта):

- находит подпись последнего сохранненого блок в базе и эмитит событие ```startSync```

### Другие методы

#### getContractState

Восстанавливает стейт контракта по таблице tx, выбирая из базы все транзакции по указанному контракту и последовательно
накатывая изменившиеся ключи

#### getVotesStat

Вычисляет статистику бюллетеней в указанном контракте\

- обычные данные
    - ```COUNT(*) "all"```
    - ```SUM(processed::INTEGER)::INTEGER "processed"```
    - ```COUNT(*) FILTER(WHERE NOT valid AND processed) "fail"```
- подробные данные
    - ```COUNT(DISTINCT sender_public_key) "unique"```
    - ```COUNT(DISTINCT sender_public_key) FILTER(WHERE valid) "success"```
    - ```COUNT(*) FILTER(WHERE NOT valid AND NOT failed AND processed) "validationFailed"```
    - ```COUNT(*) FILTER(WHERE failed AND processed) "contractFailed"```

---

## Crypto module
Вся криптография выполняется с помощью библиотеки https://www.npmjs.com/package/secp256k1, которая предоставляет биндинги на нативную библиотеку https://github.com/bitcoin-core/secp256k, тяжелые задачи воыполняются в несколько потоков\
На старте приложения создается два пула воркеров для коротких (валидация, суммирование) и долгих задач (расчет
результата)\
Для межпроцессного взаимодействия используется сериализация advanced:

```
Advanced serialization
Added in: v13.2.0, v12.16.0
Child processes support a serialization mechanism for IPC that is based on the serialization API of the v8 module,
based on the HTML structured clone algorithm. This is generally more powerful and supports more built-in JavaScript
object types, such as BigInt, Map and Set, ArrayBuffer and TypedArray, Buffer, Error, RegExp etc.

However, this format is not a full superset of JSON, and e.g. properties set on objects of such built-in types will
not be passed on through the serialization step. Additionally, performance may not be equivalent to that of JSON,
depending on the structure of the passed data. Therefore, this feature requires opting in by setting the serialization
option to 'advanced' when calling child_process.spawn() or child_process.fork().
```

### Переменные окружения

- CRYPTO_THREADS - количество воркеров для коротких задач
- SHORT_TASK_TIMEOUT - таймаут для коротких задач в миллисекундах, по умолчанию равен RABBIT_MQ_ASYNC_SLOTS_COUNT или 1
- LONG_CRYPTO_THREADS - количество воркеров для длинных задач
- LONG_TASK_TIMEOUT - таймаут для длинных задачу в миллисекундах, по умолчанию равен RABBIT_MQ_ASYNC_SLOTS_COUNT или 1
- MAX_CONCURRENT_CALLS - количество одновременных вызовов на одном воркере, позволяет уменьшить оверхед по памяти и
  время запуска процесса, полезно если воркеров больше чем доступных процессоров

### Методы

#### generatePrivateKey - генерирует приватный ключ на кривой

#### generateKeyPair - генерирует ключевую пару

#### validatePoint - проверяет находится ли точка на кривой

#### validatePrivateKey - проверяет соответствует ли приватный ключ публичному

#### addCommissionPublicKey - смешивает два публичных ключа

#### validateBulletin - выполняется на воркере, возвращает ```{ result: boolean, message: string }```

#### addVotes - выполняется на воркере, суммирует бюллетени и возвращает новую сумму

#### decryption - расчитывает частичную расшифровку

#### validateDecryption - проверяет частичную расшифровку

#### calculateResults - выполняется на воркере, в один проход находит множители (количество голосов за кандидата) для расшифрованных точек

---

## Counter module

На старте начинает валидацию и подписывается на ```blockParsed``` при получении которого вызывается валидация, если в
данный момент валидация не ведется

### Валидация

- выбирается ```VALIDATION_CHUNK_SIZE``` бюллетеней, ожидающих обработки ```{ processed: false, failed: false }```
- если нет бюллетеней выходим из цикла и ждем событие ```blockParsed```
- на каждый бюллетень создаем промис
    - загружается и кешируется стейт контракта (ключ голосования, размерность)
    - в случае нехватки данных или битого стейта, бюллетень считается невалидным
    - бюллетень отправляется на валидацию
- после выполнения всех промисов
    - подсчитывается и выводится статистика
    - обновляется флаг valid
    - обновляется флаг processed
- если еще остались бюллетени удовлетворяющие ```{ processed: false, failed: false }```, запускаем новую итерацию, или
  выходим из цикла подсчета

### Суммирование

Для суммирования используется отдельный пул постгри

- запрашиваем стрим бюллетеней по контракту с условием ```valid: true```, последний для каждого
  уникального ```sender_public_key```
- при поступлении данных, из бюллетеней выбираются точки ```AB```, записываются в массив и вызывается ```count()```
- при завершении стрима устанавливается флаг finished и вызывается ```count()```
- метод ```count()```
    - если есть флаг лока выходим
    - ставится флаг лока
    - пока в массиве ```AB``` больше одного элемента
        - если в массиве больше чем ```MAX_QUEUE_LENGTH``` стрим ставится на паузу
        - выбираются первые ```SUM_CHUNK_SIZE```
        - отправлются на сложение
        - получившаяся сумма дописывается в конец массива
        - если количество элементов в массиве стало меньше чем ```MAX_QUEUE_LENGTH``` стрим возобновляется
- в конце остается сумма точек ```AB```

### Revalidate

- устанавливается флаг `processed: false` для всех бюллетеней, у которых `valid: false` и `failed: false` (сфейлены на
  декрипте)
- при получении следующего блока эти бюллетени попадают в цикл валидации

---

## GRPC Module

Модуль состоит из

- GRPC Client - устанавливает соединение с учетом [конфига авторизации](#auth-module) и маппит конфиг ноды
- Broadcast Service - генерирует, подписывает и отправляет транзакции через GRPC
- GRPC Service - подписывается на стрим блоков, парсит их и передает дальше

### GRPC Service

На старте подписывается на события управления стримом от [Blockchain module](#blockchain-module)\
Запускается цикл проверки GRPC соединения. Раз в 10 секунд, если последнее сообщение было получено больше чем
```DEAD_BLOCKCHAIN_TIMEOUT``` миллисекунд назад, инкрементируется счетчик. При достижении значния константы
```MAX_DEAD_GRPC_WARNINGS``` (дефолт: 5), разрывается соединение и сервис пытается установить соединение с другой нодой.

Сервис имеет два кеша ```liquidTxs``` и ```finalTxs``` с временем жизни равным константе ```TX_POOL_TTL``` (дефолт:
300с)

```liquidTxs``` наполняется событиями ```microBlockAppended```, очищается при получении ```appendedBlockHistory```
и ```blockAppended```

```finalTxs``` наполняется транзакциями из событий ```appendedBlockHistory``` и ```blockAppended```, используется для
ожидания майнинга транзакций

При завершении стрима, получении ошибки или разрыва соединения со стороны клиента, происходит переподключение.

#### Обработка grpc сообщений

##### microBlockAppended

- транзакции декодируются из protobuf и записываются в кеш ```liquidTxs```

##### blockAppended

- декодируются из protobuf данные блока и список айди вошедших транзакций
- из кеша ```liquidTxs``` достаются тела транзакций блока и удаляются из кеша
- если в кеше нет нужных транзакций, разрывается соединение и происходит переподключение
- транзакции маппятся в нужный формат
- транзакции записываются в ```finalTxs```
- эмитится событие ```blockReceived```

##### appendedBlockHistory

- декодируются из protobuf данные блока и тела транзакций
- транзакции блока удаляются из кеша ```liquidTxs```, если они там есть
- транзакции маппятся в нужный формат
- транзакции записываются в ```finalTxs```
- эмитится событие ```blockReceived```

##### rollbackCompleted

- эмитится событие rollback с подписью блока, до которого произошел роллбек

---

## Master module

Обрабатывает входящие REST и RabbitMQ запросы и отправляет транзакции.\
Если запрос получен через RabbitMQ, после успешного или неуспешного майнинга транзакции, отправляется
сообщение ```updateStatus``` с новым объектом [Poll](amqp-documentation/Poll.md)

### createPoll - создание голосования

- проверяется есть ли указанный poll_id в базе
- если его нет, генерируется ключевая пара
- приватный ключ шифруется с секретом ```AES256_SECRET``` алгоритмом ```AES256-CTR```
- данные по голосованию сохраняются в базу
- в случае успеха устанавливается статус pollStarted
- если транзакция не смайнилась, голосование удаляется из базы

### addMainKey - загрузка mainKey

- [восстанавливается стейт](#getcontractstate)
- проверяется валиден ли публичный ключ и голосование еще не началось
- если статус не соответствует методу, восстанавливается актуальный статус по стейту
- отправляется транзакция addMainKey с публичными ключами голосования
- в случае успеха устанавливается статус mainKeySent
- при ошибке статус откатывается на pollStarted

### startVoting - старт голосования

- [восстанавливается стейт](#getcontractstate)  и проверяется, что статус mainKeySent
- отправляется транзакция
- в случае успеха статус изменяется на pollActive

### finishVoting - завершение голосования

- [восстанавливается стейт](#getcontractstate) и проверяется, что статус pollActive
- отправляется транзакция
- в случае успеха статус изменяется на waitingCommissionKey

### addCommissionPrivKey - подсчет результатов

- [восстанавливается стейт](#getcontractstate) и проверяется, что статус waitingCommissionKey
- проверяется валидность приватного ключа
- проверяется, что все бюллетени контракта обработаны
- если есть валидные бюллетени, устанавливается статус prepareResults
- считается сумма бюллетеней
- считается частичная расшифровка на ключах комиссии и декрипта
- отправляются транзакции с частичными расшифровками
- считается финальный результат и отправляется транзакция с ним
- если транзакция смайнилась устанавливается статус resultsReady
- в противном случае устанавливается статус resultsFailed или откатывается на waitingCommissionKey в случае ошибки в
  логике

### recoverPoll - восстановление голосования на бекап-сервисе

- валидируются входные данные
- [восстанавливается стейт](#getcontractstate)
- восстанавливается статус
- восстанавливается запись в таблице с ключами голосования

### votesStat - вывод подробной статистики

- вызывается метод [getVotesStat](#getvotesstat) из [Blockchain module](#blockchain-module)

### getPoll - вывод информации по голосованию

- восстанавливается стейт голосования
- вызывается метод [getVotesStat](#getvotesstat) из [Blockchain module](#blockchain-module)
- возвращается [Poll](amqp-documentation/Poll.md)
