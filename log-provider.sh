#/bin/bash
while true
do
 { echo -ne "HTTP/1.0 200 OK\r\nContent-Length: $(wc -c <top.csv)\r\nAccess-Control-Allow-Origin: *\r\n\r"; cat top.csv;  } | nc -v -l -p 4870
done
