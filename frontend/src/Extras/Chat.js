import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { LastMessage, SameSender, SameSenderMargin, SameUser } from '../Configuration/logic'
import  ScrollableFeed   from 'react-scrollable-feed'
import { ChatState } from '../Context/ChatProvider'

const Chat = ({ messages }) => {

    const {user} = ChatState()
  return (
    <ScrollableFeed>
          {messages && messages.map((m, i) => (
              <div style={{ display: 'flex', color:'black' }} key={m._id}> {(SameSender(messages, m, i, user._id) ||
                  LastMessage(messages, i, user._id)) && (<Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                      <Avatar mt={'7px'} mr={1} size='sm' cursor={'pointer'} name={m.sender.name} src={m.sender.pic} />        
                  </Tooltip>
                  )}
                  <span style={{
                      backgroundColor: `${
                          m.sender._id === user._id ? '#87CEFA' : '#90D8D0'
                          }`, borderRadius: '20px', padding: '5px 15px', maxWidth: '75%',
                      marginLeft: SameSenderMargin(messages, m, i, user._id),
                      marginTop: SameUser(messages, m, i, user._id) ? 4 : 11,
                  }}>
                     {m.content} 
                  </span>
              </div>
      ))}
    </ScrollableFeed>
  )
}

export default Chat
