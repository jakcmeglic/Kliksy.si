npm run dev > server_test.log 2>&1 &
SERVER_PID=$!
sleep 5
node test_zip.cjs
kill $SERVER_PID
