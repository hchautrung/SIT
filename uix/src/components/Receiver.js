import React, { useEffect, useState } from 'react';
import { Card, List, Badge } from 'antd';

const Receiver = ({ payload, offlineMessage, onReadOfflineMessage }) => {
  const [messages, setMessages] = useState([]);
  const [offMessages, setOffMessages] = useState(offlineMessage);

  useEffect(() => {
    if (payload.topic) {
      setMessages(messages => [...messages, payload])
    }
	setOffMessages(offlineMessage)
  }, [payload, offlineMessage])

  const renderListItem = item => {
    return(
      <List.Item>
		  {item.offline
		  ? (<List.Item.Meta
				title={<div className='offline-text-color'>{item.topic}</div>}
				description={<div className='offline-text-color'>{item.message}</div>}
		  	/>)
		  : (<List.Item.Meta
				title={<div className='online-text-color'>{item.topic}</div>}
				description={<div className='online-text-color'>{item.message}</div>}
		  	/>)
		  }
      </List.Item>
    )
  }

	const readOffMessage = (e) => {
		e.preventDefault();
		/* append offine messge on the top of message */
		const combinedMessage = [];
		offMessages.map(msg => {
			combinedMessage.push({
				topic: msg.topic,
				message: JSON.stringify({
					datetime: msg.datetime, 
					exercise_routine: msg.exercise_routine, 
					duration: msg.duration, 
					user: {id: msg._id, username:""}
				}),
				offline: true
			});
		});

		messages.map(msg => {
			combinedMessage.push({...msg, user: {...msg.user}});
		})

		setMessages(combinedMessage);
		onReadOfflineMessage();
	}

	const renderCardTitle = () => {
		if(offMessages && offMessages.length) return (<Badge count={offMessages.length}><a href="/#" onClick={readOffMessage}>Notification</a></Badge>)
		else return "Notification";
	}

  return (
    <>
      <Card
        title={renderCardTitle()}
        className='card'
      >
        <List
          size="small"
          bordered
          dataSource={messages}
          renderItem={renderListItem}
		  locale={{ emptyText: "No Message" }}
        />
      </Card>
    </>
    
  );
}

export default Receiver;