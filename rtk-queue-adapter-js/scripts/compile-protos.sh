#! /bin/bash

cd $(dirname $0)/../

SRC_DIR=src/grpc/proto/
DEST_DIR=src/grpc/proto

node_modules/.bin/pbjs \
-t static-module \
-w commonjs \
-p ${SRC_DIR} \
-o ${DEST_DIR}/root.js \
${SRC_DIR}/messagebroker/messagebroker_blockchain_events_service.proto \
${SRC_DIR}/util/util_contract_status_service.proto \
${SRC_DIR}/util/util_node_info_service.proto \
${SRC_DIR}/transaction/transaction_public_service.proto

node_modules/.bin/pbts \
-o ${DEST_DIR}/root.d.ts \
${DEST_DIR}/root.js
