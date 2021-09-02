# 2021-02-15 v1.0.0
- init version

# dark ages

# 2020-09-02 v0.11.1
- votes query fix & optimization
- recount cmd fix
- mainkey in decryption db
- extended status system in GET poll

# 2020-08-26 v0.11.0
- support for new range proofs
- do not accept commissionPubKey before main subscribed to voting

# 2020-08-25 v0.10.1
- validate commission private key
- throw error if no votes counted
- async PUT methods
- recountMain command fix

# 2020-08-20 v0.10.0
- new methods for commission partial decryption support
- small fixes
- listen dateEnd change after finalize from crawler

# 2020-08-19 v0.9.6
- reject whole bulletin, not one question
- job service ref
- finalizeVoting command
- fixed 404 error when finalize voting

# 2020-08-14 v0.9.4-RC17
- send zero results fixed
- count invalid bulletins

# 2020-08-12 v0.9.4-RC15
- fixed recount command 
- data validation in POST /v1/poll request
- encrypted private keys
- log invalid bulletins
- contract image hash filtration for production
- envs config validation
- blindSigKey validation
- start new round if main key not valid

# 2020-08-06 RT-4

- response with voting info from database if contract not mined
- log votes num when decryption finished
- blind signature generation fix
- validation for post params
- finalization fix
- error handling in contract state service
- processed votes num on GET /poll/:pollid
- fixed sums calculation
- contract state service refactored

# 2020-07-31 RT-1

- removed copy of voting-encrypt from code
- restart on postgres error
- BALANCE_WATCHER_ENABLE env
- don't send tx if poll with same pollId exists
- proper sums history with proper height
- fixed migrations
- verifying blind signatures for type blind
- startNewRound command
- rollback handling for sums calculation
- jobsStatus command
- listEnvs & setEnv command in dev mode
- BLIND_SIGNATURE_VERIFY env & defaults for some envs
- refactored ContractStateService
- fixed empty sums history
