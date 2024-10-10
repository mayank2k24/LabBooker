import React, { useState } from 'react';


const HelpIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Help Request');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nDescription: ${description}`);
    window.location.href = `mailto:help@labbooker.mayankgroup.tech?subject=${subject}&body=${body}`;
    setIsOpen(false);
    setName('');
    setEmail('');
    setDescription('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      {isOpen ? (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="How can we help?" required />
          <button type="submit">Send</button>
          <button type="button" onClick={() => setIsOpen(false)}>Close</button>
        </form>
      ) : (
        <button onClick={() => setIsOpen(true)} style={{ borderRadius: '50%', width: '60px', height: '60px', fontSize: '24px' }}>?</button>
      )}
    </div>
  );
};

export default HelpIcon;