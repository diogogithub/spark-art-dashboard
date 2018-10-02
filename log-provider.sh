#!/bin/bash

# last stats file to read from
FILENAME=$(ls stats-* | tail -n 1)
 
# number of lines to read
N=100
 
# time to sleep in milliseconds
SLEEP=100
 
# chunk filename
CHUNK_FILENAME="log-provider-chunk.csv"
 
header=$(head -n 1 $FILENAME)
 
while true; do
  paste <(echo $header) <(tail -n +2 $FILENAME | tail -n $N) --d '' > $CHUNK_FILENAME
  { echo -ne "HTTP/1.0 200 OK\r\nContent-Length: $(wc -c $CHUNK_FILENAME)\r\nAccess-Control-Allow-Origin: *\r\n\r"; cat $CHUNK_FILENAME; }  | nc -v -l -p 4870
  sleep ${SLEEP}e-3
done
