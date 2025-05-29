import React from 'react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const AIChat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input) return;

        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');

        // Call AI service here (to be implemented)
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });
        const data = await response.json();

        const aiMessage = { text: data.reply, sender: 'ai' };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
    };

    return (
        <div className="ai-chat">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <Button onClick={handleSend}>Send</Button>
            </div>
        </div>
    );
};

export default AIChat;