#!/bin/bash
while ! nc -z elasticsearch 9200; do
    echo "Waiting for ElasticSearch..."
    sleep 2
done
echo "ElasticSearch is up!"
