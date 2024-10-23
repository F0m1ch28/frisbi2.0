import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useStore } from '../store/store'

const Chat = () => {
  const { store } = useStore();
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    })
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Установлено соединение с сервером')
    })

    newSocket.on('message_history', (messages) => {
      setMessages(messages)
    })

    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    newSocket.on('online_users', (users) => {
      setOnlineUsers(users)
    })

    newSocket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        console.error('Сервер разорвал соединение')
      } else {
        console.log('Соединение разорвано:', reason)
      }
    })

    newSocket.on('connect_error', (err) => {
      console.error('Ошибка подключения:', err)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (inputValue.trim() !== '' && socket) {
      socket.emit('message', { content: inputValue })
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="online-users">
        <h3>Пользователи онлайн:</h3>
        <ul>
          {onlineUsers.map((email, index) => (
            <li key={index}>{email}</li>
          ))}
        </ul>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.user.id === store.user.id ? 'own' : ''}`}
          >
            <div>
              <strong>{msg.user.email}</strong>{' '}
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  )
}

export default Chat