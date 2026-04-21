import { useState, useEffect } from 'react';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Mock messages data since backend doesn't have messaging yet
      const mockMessages = [
        {
          id: 1,
          sender: 'Admin',
          recipient: 'All Users',
          subject: 'Welcome to EduHub Kids!',
          message: 'We are excited to have you join our learning community. Explore our courses and start your educational journey today!',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: false
        },
        {
          id: 2,
          sender: 'Teacher',
          recipient: 'Students',
          subject: 'New Course Available',
          message: 'Introduction to Web Development course is now available. Check it out in the courses section!',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        {
          id: 3,
          sender: 'System',
          recipient: 'All Users',
          subject: 'System Maintenance',
          message: 'Scheduled maintenance will take place this weekend. The platform will be temporarily unavailable.',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          read: true
        }
      ];

      setMessages(mockMessages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedRecipient) {
      alert('Please enter a message and select a recipient');
      return;
    }

    const message = {
      id: messages.length + 1,
      sender: localStorage.getItem('userName') || 'You',
      recipient: selectedRecipient,
      subject: 'New Message',
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    setSelectedRecipient('');
    alert('✅ Message sent successfully!');
  };

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const deleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== messageId));
    }
  };

  if (loading) {
    return (
      <div style={{fontFamily: 'Arial, sans-serif', padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
        <div style={{textAlign: 'center', color: 'white'}}>
          <div style={{fontSize: '24px'}}>⏳ Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily: 'Arial, sans-serif', padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', color: 'white'}}>
        <h1 style={{margin: 0}}>💬 Messages</h1>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <span style={{background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold'}}>
            {messages.filter(m => !m.read).length} Unread
          </span>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
        {/* Message List */}
        <div style={{background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', maxHeight: '600px', overflow: 'auto'}}>
          <h2 style={{margin: '0 0 20px 0', fontSize: '20px', color: '#333'}}>Your Messages</h2>
          
          {messages.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
              <div style={{fontSize: '40px', marginBottom: '10px'}}>📭</div>
              <p>No messages yet.</p>
              <p style={{fontSize: '14px', color: '#999'}}>Send a message to get started!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id}
                style={{
                  background: message.read ? '#f8f9fa' : '#e3f2fd',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  borderLeft: `4px solid ${message.read ? '#666' : '#3b82f6'}`
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                  <div>
                    <h3 style={{margin: '0 0 5px 0', fontSize: '16px', color: '#333'}}>{message.subject}</h3>
                    <p style={{margin: '0', fontSize: '14px', color: '#666'}}>
                      From: <strong>{message.sender}</strong> • To: {message.recipient}
                    </p>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    {!message.read && (
                      <button 
                        onClick={() => markAsRead(message.id)}
                        style={{background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}
                      >
                        Mark Read
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMessage(message.id)}
                      style={{background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{margin: '10px 0 0 0', color: '#333', lineHeight: '1.5'}}>{message.message}</p>
                <p style={{margin: '10px 0 0 0', fontSize: '12px', color: '#999'}}>
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Compose Message */}
        <div style={{background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'}}>
          <h2 style={{margin: '0 0 20px 0', fontSize: '20px', color: '#333'}}>📝 Compose Message</h2>
          
          <form onSubmit={handleSendMessage}>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>RECIPIENT</label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
                required
              >
                <option value="">Select recipient...</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
                <option value="Students">Students</option>
                <option value="All Users">All Users</option>
              </select>
            </div>

            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', color: '#666', fontSize: '12px'}}>MESSAGE</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', minHeight: '120px', resize: 'vertical'}}
                required
              />
            </div>

            <button 
              type="submit"
              style={{background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'}}
            >
              📤 Send Message
            </button>
          </form>

          <div style={{marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
            <h4 style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>💡 TIPS</h4>
            <ul style={{margin: '0', paddingLeft: '20px', color: '#666', fontSize: '13px'}}>
              <li>Messages are currently simulated for demonstration</li>
              <li>In a real application, this would connect to a messaging API</li>
              <li>Use the recipient dropdown to target specific user groups</li>
              <li>Mark messages as read to keep your inbox organized</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;