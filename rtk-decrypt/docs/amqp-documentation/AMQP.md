# AMQP API documentation

## Channels: 
- incoming
- outcoming

### [Available methods](AvailableMethods.md)

## Incoming channel:

### createPoll request

refs:
- [MainType](MainType.md)

```
{
    "pattern": "createPoll",
    "data": {
        "pollId": string,
        "type": MainType,
        "blindSigModulo": string,
        "blindSigExponent": string,
        "bulletinHash": string,
        "dimension": number[][],     
        "votersListRegistrators": string[]
    }
    "id"?: string
}
```

example

```
{
  "pattern": "createPoll",
  "data": {
    "pollId": "pqwjj784vp56kqp7f3py4dmn",
    "type": "blind",
    "blindSigModulo": "9514e5ea64baaa5d7abcd3d8dd98fb096ae7f23e30daecee2fc4b3b447d53e93e72724bc5c56d8937d965a3427005f30cc87926213d02dc8b9467b00a85e636c551e6e3a04c1f4374e40a60bdc5c596e5901b73de953f1db453ab0912051a0655e91701fdbc6a8f082185fc9957d973d51afc0963528e34e3302b8d61d245407c12f702e322f828720047f160bced9ce6edfc1fd7ced20e69c88d49a69d4f6da3f985eee2b4c17454b2d0dc415cba607c137143dd7c0ebaff2f4397aabd4588b9d1012d51c529567e26f4856f0b03ea9f266aa689cfea619fe5513f886597cd66693db3dd33e647917147cd288ddff254eb0dfcdbedda5a00ed16eae77e622cff154345bbe8603b1118ea9899b0a0fec0d023b94ea45773902445745aaba64ea3f3ae0513bfff4d9cb0376168639e923151a953e611148d73bd404d4f4c76e71a64df9fc1ab5ea6d2c6123f513e082723e3c4c3ed7c13958652c8f5c367eb8a85787c5aa76c5046c26e65e58a33153f9666324a4bee4972730b98f0f3393d7b204c6bf713a2fd6ef232b0f6d70f5ee5b1349e2a797ce85b98d56715339f1df9acfe4264b267b3f04d8d4be4258ee9026c7da526f848fbccd8709d6734ce295b90ef1e938f35164b8c172e331cc3936740144c79f9eb0b1c85b6be8c02677414c4bde15e62f647cbd61c5a8c6935367f0f0e450bcaabe84fbe78d2b8595c6257d",
    "blindSigExponent": "10001",
    "bulletinHash": "378c1d6817d318dcff6f575a55cd6bf63bb0ef1161bf63218d826dd70d570735",
    "dimension": [
        [
          1,
          1,
          3
        ],
        [
          1,
          5,
          8
        ]
    ],
    "votersListRegistrators": []
  },
  "id"?: string
}
```

### start request

```
{
  "pattern": "start",
  "data": {
    "pollId": string
  },
  "id"?: string
}
```


### getPoll request

```
{
    "pattern": "getPoll",
    "data": {
        "pollId": string
    },
    "id"?: string
}
```

### finalizePoll request

```
{
    "pattern": "finalizePoll",
    "data": {
        "pollId": string
    },
    "id"?: string
}
```

### addCommissionPubKey request

refs:
- [PointObj](PointObj.md)

```
{
    "pattern": "addCommissionPubKey",
    "data": {
        "pollId": string,
        "commissionPubKey": PointObj
    },
    "id"?: string
}
```

exmaple

```
{
  "pattern": "addCommissionPubKey",
  "data": {
    "pollId": "pqwjj784vp56kqp7f3py4dmn",
    "commissionPubKey": {
      "x": "c21514668fabd65e2f0de6b0e0b4e17e8d13402738c8ea3b7fdc30e56b16eb69",
      "y": "ce4c94ce9d6afe9aa52d0a0bb7dfe23a1896ca0c32489b042de82070effa9215"
    }
  },
  "id"?: string
}
```

### addCommissionPrivKey request

```
{
    "pattern": "addCommissionPrivKey",
    "data": {
        "pollId": string,
        "commissionPubKey": string
    },
    "id"?: string
}
```

example

```
{
  "pattern": "addCommissionPrivKey",
  "data": {
    "pollId": "pqwjj784vp56kqp7f3py4dmn",
    "commissionPrivKey": "12325822346107862275877093547995197879839878226127873615422428210574566462670"
  },
  "id"?: string
}
```

## Outcoming channel:

### createPoll response

```
Success

{
    "pattern": "createPoll",
    "data": {
        "pollId": string,
        "txId": string
    },
    "id"?: string
}

Error

{
    "pattern": "error",
    "data": {
        "message": string,
        "errorCode": "CREATE_POLL_ERROR"
    },
    "id"?: string
}
```

### start response

```
{
    "pattern": "start",
    "data": {
        "result": "completed"
    },
    "id"?: string
}

Error

{
    "pattern": "error",
    "data": {
        "message": string,
        "errorCode": "START_POLL_ERROR"
    },
    "id"?: string
}
```

### getPoll response

refs:
- [Poll](Poll.md)

```
Success

{
    "pattern": "getPoll",
    "data": {
        "poll": Poll
    },
    "id"?: string
}

Error

{
    "pattern": "error",
    "data": {
        "message": string,
        "errorCode": "GET_POLL_ERROR"
    },
    "id"?: string
}
```

### finalizePoll response

```
Success

{
    "pattern": "finalizePoll",
    "data": {
        "result": "completed"
    },
    "id"?: string
}

Error

{
    "pattern": "error",
    "data": {
        "message": string,
        "errorCode": "FINALIZE_POLL_ERROR"
    },
    "id"?: string
}
```

### addCommissionPubKey response

```
Success

{
    "pattern": "addCommissionPubKey",
    "data": {
        "result": "completed"
    },
    "id"?: string
}

Error

{
    "pattern": "error",
    "data": {
        "message": string,
        "errorCode": "ADD_COMMISSION_PUB_KEY_ERROR"
    },
    "id"?: string
}
```

### addCommissionPrivKey response

```
Success

{
    "pattern": "addCommissionPrivKey",
    "data": {
        "result": "completed"
    },
    "id"?: string
}

Error

{
    "pattern": "error",
    "data": {
        "message": string,
        "errorCode": "ADD_COMMISSION_PRIV_KEY_ERROR"
    },
    "id"?: string
}
```

### updateStatus event

refs:
- [Poll](Poll.md)

```
{
    "pattern": "updateStatus",
    "data": {
        poll: Poll
    },
    "id"?: string
}
```

### Дополнительное описание работы декрипт сервера с rabbit mq.

1. При старте декрипт сервер создает exchange с заданным в настройках именем. По соглашению имя exchange - voting.  
2. Затем создает 2 очереди (queue) с заданными в настройках именами. По соглашению очереди должны начинаться со слов incoming
и outcoming.
3. Затем декрипт сервер биндит эти очереди по routing key к ранее созданному exchange.
Название routing key совпадает с названиями очередей.
   
Для того, чтобы несколько клиентов могли работать с одним декрипт сервером необходимо, чтобы
каждый новый клиент перед стартом создавал свою очередь с уникальным названием и привязывал (биндил)
эту очередь к exchange, созданному декриптом, по routing key созданному декриптом.

# Changelog

### 1.0.0

- Новый метод "start". См. [Available methods](AvailableMethods.md).

- Из метода "createPoll" удалено поле dateStart.

- Добавлено новое опциональное поле "id" для запросов. 
```
{
    "pattern": "methodName",
    "data": {
        poll: Poll
    },
    "id"?: string <== новое поле
    _____________
}
```
Поле необходимо для того, чтобы сопоставить запросы с соответствующими ответами. 
Указав данное поле в запросе, ответ будет содержать такой же id.
