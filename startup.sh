#!/bin/sh
cd $(dirname $0)
nohup ./gomd >run.log 2>&1 & 