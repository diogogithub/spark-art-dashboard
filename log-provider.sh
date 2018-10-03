#!/bin/sh

# CSV file name
FILENAME=$(ls stats-* | tail -n 1)

# chunk file name
CHUNK_FILENAME="current-log-provider-chunk.csv"

# number of log lines for chunk
N=100

# server port
PORT=4870

# CSV header
header=$(head -n 1 "$FILENAME")

while true; do
 # We don't want repeated headers
 if [ $(wc -l < "$FILENAME") -gt "$N" ]; then
   { echo "$header"; tail -n "$N" $FILENAME; } > "$CHUNK_FILENAME"
 else
   cp -f -- "$FILENAME" "$CHUNK_FILENAME"
 fi
 { echo -ne "HTTP/1.0 200 OK\r\nContent-Length: $(wc -c <"current-log-provider-chunk.csv")\r\nAccess-Control-Allow-Origin: *\r\n\r"; cat "current-log-provider-chunk.csv";  } | nc -v -l -p "$PORT"
done
