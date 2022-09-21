import queue

class MessageAnnouncer:
    '''
    Class for a pub-sub pattern.
    '''

    def __init__(self):
        self.listeners = []

    def listen(self):
        '''
        Subscribe to message stream.
        
        Returns: 
            a queue that contains messages from the announcer
        '''
        q = queue.Queue(maxsize=5)
        self.listeners.append(q)
        return q

    def announce(self, msg: str) -> None:
        '''
        Send message to all listners

        Input:
            String message to be sent to all listners that are currently subscribed to this message anouncer. 
        '''
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(msg)
            except queue.Full:
                del self.listeners[i]

class SSEMessageAnnouncer(MessageAnnouncer):
    '''
    Message Announcer specifically tailored for server sent events.
    '''

    def announce(self, msg: str, event=None) -> None:
        '''
        Sends a server sent event message to all listners. The given message will automatically be formated acourding to the 
        event format. 
        https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format

        Input:
            - msg: String message to send to listners, will be formated in event format
            - event: String event to be added to the message sent to the listners, that can clasify what type of event the
                    message is describing. 
        '''
        return super().announce(format_sse(msg, event))
    
def format_sse(data: str, event=None) -> str:
    '''
    Formats a string TODO
    '''
    msg = f'data: {data}\n\n'
    if event is not None:
        msg = f'event: {event}\n{msg}'
    return msg