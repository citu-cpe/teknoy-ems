#!/bin/bash

export NEXT_PUBLIC_VERCEL_GIT_IS_PULL_REQUEST=$(echo $VERCEL_GIT_IS_PULL_REQUEST)
export NEXT_PUBLIC_VERCEL_GIT_PULL_REQUEST_NUMBER=$(echo $VERCEL_GIT_PULL_REQUEST_NUMBER)
