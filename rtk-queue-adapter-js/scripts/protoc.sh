#!/usr/bin/env bash
BASEDIR="./src/grpc"

mkdir -p ${BASEDIR}/compiled

./node_modules/.bin/grpc_tools_node_protoc ${BASEDIR}/proto/*/*.proto \
  ${BASEDIR}/proto/*.proto --proto_path=${BASEDIR}/proto \
  --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" \
  --js_out=import_style=commonjs,binary:${BASEDIR}/compiled \
  --grpc_out="grpc_js:${BASEDIR}/compiled" \
  --ts_out="service=grpc-node,mode=grpc-js:${BASEDIR}/compiled"
