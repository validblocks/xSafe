#!/bin/bash

if [[ -z "$@" ]]; then
    echo >&2 "you must supply an argument"
    exit 1
elif [ "$1" != "mainnet" ] && [ "$1" != "staging" ] && [ "$1" != "devnet" ] && [ "$1" != "testnet" ]; then
    echo >&2 "$@ is not a valid deploy stage"
    exit 1
fi

STACK_NAME=$1-multisig-backend
REGION=us-east-1
S3_BUCKET=us-east-1-sam-bucket
TEMPLATE=template.yaml

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" != "master" ]]; then
  echo 'Not on [master] branch - Aborting';
  exit 1;
fi

rm build.yaml

sam validate --template $TEMPLATE

sam package \
  --template-file $TEMPLATE \
  --output-template-file build.yaml \
  --s3-bucket $S3_BUCKET

sam deploy \
  --region $REGION \
  --template-file build.yaml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Stage=$1
