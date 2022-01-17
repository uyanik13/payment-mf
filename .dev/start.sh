#!/bin/bash

open -a Docker

minikube start
kubectx minikube
tilt up