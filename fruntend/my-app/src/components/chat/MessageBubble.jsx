import { useMemo } from 'react';

const styles = {
  bubbleWrapper: (isMe) => ({
    display: 'flex',
    justifyContent: isMe ? 'flex-end' : 'flex-start',
    marginBottom: '8px',
  }),
  bubble: (isMe) => ({
    maxWidth: '65%',
    padding: '6px 7px 8px 9px',
    borderRadius: '7.5px',
    background: isMe ? '#d9fdd3' : '#ffffff',
    color: '#111b21',
    wordWrap: 'break-word',
    boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)',
    position: 'relative',
    fontSize: '14.2px',
    lineHeight: '19px',
    borderTopRightRadius: isMe ? 0 : '7.5px',
    borderTopLeftRadius: isMe ? '7.5px' : 0,
  }),
  image: {
    maxWidth: '100%',
    maxHeight: '250px',
    borderRadius: '12px',
    cursor: 'pointer',
    objectFit: 'cover',
    marginTop: '5px',
  },
  text: {
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  meta: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '-4px',
    gap: '4px',
    float: 'right',
    marginLeft: '8px',
    position: 'relative',
    top: '4px',
  },
  timestamp: {
    fontSize: '11px',
    color: '#667781',
  },
};

export default function MessageBubble({ msg }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isMe = useMemo(() => String(msg.senderId) === String(user._id), [msg.senderId, user._id]);

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };

  const openImageInNewTab = (url) => {
    window.open(getImageUrl(url), '_blank');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.bubbleWrapper(isMe)}>
      <div>
        <div style={styles.bubble(isMe)}>
          {msg.text && (
            <p style={styles.text}>{msg.text}</p>
          )}
          {msg.imageUrl && (
            <img
              src={getImageUrl(msg.imageUrl)}
              alt="Chat attachment"
              style={styles.image}
              onClick={() => openImageInNewTab(msg.imageUrl)}
            />
          )}
        </div>
        <div style={styles.meta}>
          <span style={styles.timestamp}>{formatTime(msg.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}