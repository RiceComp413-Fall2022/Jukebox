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

if [ "$USER_TYPE" = "Server" ]; then
  cd src/server
  flask --app main run -p $USER_PORT

elif [ "$USER_TYPE" = "Client" ]; then
  cd src/client
  npm install
  npm start # Uncomment once port specification added --port $USER_PORT

else
  echo "Invalid user type: valid types 'Server' and 'Client'. Aborting."
fi

