import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import LucideIcon from '../common/LucideIcon';

export default function ContactSupport({ triggerToast, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      if (triggerToast) triggerToast('Please enter your name.', 'circle-alert');
      return;
    }
    
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      if (triggerToast) triggerToast('Please enter a valid email address.', 'circle-alert');
      return;
    }

    if (!message.trim()) {
      if (triggerToast) triggerToast('Support message cannot be blank.', 'circle-alert');
      return;
    }

    if (triggerToast) {
      triggerToast('Message prepared successfully. Contact submission is not connected to a server.');
    }
    
    // Simulate cleanup and close
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsFormVisible(false);
  };

  if (!isFormVisible) {
    return (
      <Card>
        <span className="icon green">
          <LucideIcon name="headphones" />
        </span>
        <h3 style={{ font: '600 15px Poppins', margin: '14px 0 4px' }}>
          Need direct assistance?
        </h3>
        <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>
          Our field operations team is available Monday-Saturday, 9:00 AM-6:00 PM IST.
        </p>
        <Button
          variant="primary"
          icon="message-circle"
          iconPosition="right"
          style={{ marginTop: '12px' }}
          onClick={() => setIsFormVisible(true)}
        >
          Contact support
        </Button>
      </Card>
    );
  }

  return (
    <Card>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>Contact Support</h3>
         {onCancel && (
           <Button variant="secondary" onClick={() => setIsFormVisible(false)} style={{ padding: '4px 10px', fontSize: '12px' }}>
             Cancel
           </Button>
         )}
       </div>
       <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Submit a ticket to regional dispatch.</p>
       
       <form onSubmit={handleSubmit} className="form-grid">
         <label>
           Your Name
           <input placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} />
         </label>
         <label>
           Email Address
           <input type="email" placeholder="email@jalshakti.gov.in" value={email} onChange={(e) => setEmail(e.target.value)} />
         </label>
         <label className="wide">
           Subject
           <input placeholder="Issue summary" value={subject} onChange={(e) => setSubject(e.target.value)} />
         </label>
         <label className="wide">
           Message
           <textarea rows="4" placeholder="Describe your issue..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
         </label>

         <div className="wide" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
           <Button variant="primary" icon="send" type="submit">Prepare Message</Button>
         </div>
       </form>
    </Card>
  );
}
