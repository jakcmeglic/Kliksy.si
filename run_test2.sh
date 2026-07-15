npm run dev > server_test2.log 2>&1 &
SERVER_PID=$!
sleep 5
node test_zip_small.cjs
kill $SERVER_PID
