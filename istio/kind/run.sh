#!/bin/bash

CURRENT_LOCATION="$(dirname $0)/";
kind create cluster --name istio-workshop; # --config=$CURRENT_LOCATION/config.yaml;
