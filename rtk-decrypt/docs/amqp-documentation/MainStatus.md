```
enum MainStatus {
    pollInitiated = 'pollInitiated',
    pollStarted = 'pollStarted',
    pollFailed = 'pollFailed',
    dkgCompleted = 'dkgCompleted',
    mainKeySent = 'mainKeySent',
    pollActive = 'pollActive',
    pollHalted = 'pollHalted',
    pollCompleted = 'pollCompleted',
    waitingCommissionKey = 'waitingCommissionKey',
    prepareResults = 'prepareResults',
    resultsReady = 'resultsReady',
    resultsFailed = 'resultsFailed',
}
```

```
pollInitiated - дефолтный статус при создании записи в БД мастера 
```

```
pollStarted - 103 транзакция смайнилась и начат процесс DKG
```

```
pollFailed - 103 транзакция не смайнилась
```

```
dkgCompleted - DKG завершен, ожидание публичного ключа комиссии
```

```
mainKeySent - отправлен mainKey 
```

```
pollActive - этап получения голосов
```

```
pollHalted - метод finalize вызвали до dateStart
```

```
pollCompleted - dateEnd прошел
```

```
waitingCommissionKey - ождидание приватного ключа комиссии
```

```
prepareResults - ождидание частичных расшифровок декриптов
```

```
resultsReady - подготовлены результаты голосования
```

```
resultsFailed - подсчет результатов завершился неудачей
```
