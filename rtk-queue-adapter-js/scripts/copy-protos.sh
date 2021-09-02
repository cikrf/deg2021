#! /bin/bash

cd $(dirname $0)/../

SRC_DIR=src/grpc/proto
DEST_DIR=dist/src/grpc/proto

rm -rf ${DEST_DIR}
cp -r ${SRC_DIR} ${DEST_DIR}
