import React, { useState } from 'react';
import './HelpIcon.modules.css';
import { MessageCircleQuestion } from 'lucide-react';

const HelpIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if(name.trim() === '' || email.trim() === '' || description.trim() === ''){
      setError('All fields are required');
      return;
    }
    const subject = encodeURIComponent('Help Request');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nDescription: ${description}`);
    window.location.href = `mailto:help@labbooker.mayankgroup.tech?subject=${subject}&body=${body}`;
    setIsOpen(false);
    setName('');
    setEmail('');
    setDescription('');
  };

  return (
    <div className="help-icon-container">
    {isOpen ? (
      <form onSubmit={handleSubmit} className={`help-form ${isOpen ?'open':''}`}>
        <h2>How can we help?</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your issue" required />
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button type="submit" className="submit-btn">Send</button>
          <button type="button" onClick={() => setIsOpen(false)} className="close-btn">Close</button>
        </div>
      </form>
    ) : (
      <button onClick={() => setIsOpen(true)} className="help-button" aria-label="OpenHelp">
        <span className='help-icon' aria-hidden="true"><MessageCircleQuestion size={36} /></span>
      </button>
    )}
  </div>
  );
};

export default HelpIcon;