refs:
- [MainStatus](MainStatus.md)
- [PublicDecryptionStatus](PublicDecryptionStatus.md)
- [MainType](MainType.md)
- [Point](Point.md)

```
{
    "status": MainStatus,
    "type": MainType,
    "bulletinHash": string,
    "dimension": number[],
    "dateStart": number, // unit - ms
    "dateEnd": number, // unit - ms
    "blindSigModulo": string,
    "blindSigExponent": string,
    "mainKey": Point | null,
    "votesUnique": number,
    "votesAll": number,
    "votesFail": number,
    "votesSuccess": number,
    "results": number[][],
    "txId": string,
}
```
