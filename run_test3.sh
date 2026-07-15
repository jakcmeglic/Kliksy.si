tsx server.ts > server_test3.log 2>&1 &
SERVER_PID=$!
sleep 5
node test_zip_google.cjs
kill $SERVER_PID
