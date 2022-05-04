import {useState, useEffect} from "react";
import mqtt from 'mqtt';

export default function useMQTT(params) {
    const { /* EQMX */
            host = 'broker.emqx.io', 
            port = 8083,
            /* HiveMQ */
            /*
            host = 'broker.hivemq.com',
            port = 8000,
            */
            clientId  = `mqtt_ + ${Math.random().toString(16).slice(2, 6)}`} = params;

    const [client, setClient] = useState(null);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState(null);

    useEffect (() => {
        /*
        const url = `ws://${host}:${port}/mqtt`;
        const options = {
            keepalive: 30,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            will: {
                topic: 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos: 0,
                retain: false
            },
            rejectUnauthorized: false
        };
        options.clientId = clientId;
        options.username = username;
        options.password = password;
        
        setStatus('connecting');
        const clientMqtt = mqtt.connect(url, options)
        setClient(clientMqtt);
        */
    }, [])

    useEffect (() => {
        if(!client) return;
      
        client.on('connect', () => {
            setStatus('connected');
        });
        client.on('error', (err) => {
            setError(err);
            client.end();
        });
        client.on('reconnect', () => {
            setStatus('reconnecting');
        });
        client.on('message', (topic, message) => {
            const payload = { topic, message: message.toString() };
            setMessage(payload);
        });
    }, [client])

    const connect = (params = {}) => {
        const { keepalive = 30, 
                reconnectPeriod = 1000, 
                connectTimeout = 30 * 1000, 
                qos = 0, 
                rejectUnauthorized = false,
                username = '',
                password = ''} = params;

        const url = `ws://${host}:${port}/mqtt`;
        const options = {
            keepalive: keepalive,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: reconnectPeriod,
            connectTimeout: connectTimeout,
            will: {
                topic: 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos: qos,
                retain: false
            },
            rejectUnauthorized: rejectUnauthorized
        };
        options.clientId = clientId;
        options.username = username;
        options.password = password;
        setStatus('connecting');
        const clientMqtt = mqtt.connect(url, options)
        setClient(clientMqtt);
    }

    const publish = context => {
        return new Promise((resolve, reject) => {
            const { topic, payload, qos = 0 } = context;
            client.publish(topic, payload, { qos }, err => {
                if (err){
                    setError(err);
                    reject(err);
                }
                else resolve(payload)
            });
        })
    }

    const subscribe = (subscription) => {
        return new Promise((resolve, reject) => {
            const { topic, qos = 0 } = subscription;
            client.subscribe(topic, { qos }, (err, granted) => {
                if (err){
                    setError(err);
                    reject(err);
                }
                else resolve(granted); /* array of {topic, qos} */
            });
        })
    }

    const unSubscribe = (subscription) => {
        return new Promise((resolve, reject) => {
            const { topic } = subscription;
            client.unsubscribe(topic, err => {
                if (err){
                    setError(err);
                    reject(err);
                }
                else resolve(true);
            });
        })
    };

    return {status, message, error, connect, publish, subscribe, unSubscribe};
}