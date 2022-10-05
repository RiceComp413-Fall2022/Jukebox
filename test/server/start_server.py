from ...src.server.main import app

def start():
    '''
    Start server on localhost, port 5000. 
    '''
    app.run(host='127.0.0.1', port='5000', debug=True)