export const SOCKET_CONNECT_PENDING = 'SOCKET_CONNECT_PENDING';
export const SOCKET_CONNECT_SUCCESS = 'SOCKET_CONNECT_SUCCESS';
export const SOCKET_CONNECT_ERROR   = 'SOCKET_CONNECT_ERROR';
export const SOCKET_CONNECT_END     = 'SOCKET_CONNECT_END';
export const connect = data => ({
    type: SOCKET_CONNECT_PENDING,
    data
});

export const SOCKET_SENT_PENDING    = 'SOCKET_SENT_PENDING';
export const SOCKET_SENT_SUCCESS    = 'SOCKET_SENT_SUCCESS';
export const SOCKET_SENT_ERROR      = 'SOCKET_SENT_ERROR';
export const send = data => ({
    type: SOCKET_SENT_PENDING,
    data
});

export const SOCKET_RECEIVED_SUCCESS= 'SOCKET_RECEIVED_SUCCESS';
export const SOCKET_RECEIVED_ERROR  = 'SOCKET_RECEIVED_ERROR';

