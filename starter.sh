set -e

if [ -n "$2" ]; then
  echo "Using port $2";
  echo "**Note custom ports only enabled for servers not clients.**s"
  USER_PORT=$2
else
  echo "Defaulting to port 5000";
  USER_PORT=5000
fi

echo "Attempting to start user of type: $1";
USER_TYPE=$1

if [ "$USER_TYPE" = "server" ]; then
  cd src/server
  flask --app main run --host=0.0.0.0 -p $USER_PORT --cert /etc/letsencrypt/live/jukebox.lol/fullchain.pem --key /etc/letsencrypt/live/jukebox.lol/privkey.pem --no-reload --with-threads

elif [ "$USER_TYPE" = "client" ]; then
  cd src/client
  npm install
  npm start --host=0.0.0.0 # Uncomment once port specification added --port $USER_PORT

else
  echo "Invalid user type: valid types 'server' and 'client'. Aborting."
fi

