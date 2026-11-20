import { useEffect, useRef, useState } from 'react';
import Button from '../shared/Button.jsx';
import ProfilePhoto from '../shared/ProfilePhoto.jsx';
import { api } from '../../services/api.js';
import { classNames } from '../../utils/classNames.js';
import styles from './MatchChatModal.module.css';

const ICEBREAKERS = [
  'Okay, this is a little awkward 😅',
  'What’s your go-to coffee order?',
  'Best spot around campus?',
];

export default function MatchChatModal({ match, onClose, onMessageSent }) {
  const dialogRef = useRef(null);
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('loading');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    api
      .getMessages(match.id)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.messages);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [match.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  async function submitText(text) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError(null);
    try {
      const { message, autoReply } = await api.sendMessage(match.id, trimmed);
      setMessages((prev) => (autoReply ? [...prev, message, autoReply] : [...prev, message]));
      setDraft('');
      onMessageSent?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitText(draft);
  }

  const { profile } = match;

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="chat-title" onClose={onClose}>
      <header className={styles.header}>
        <div className={styles.person}>
          <div className={styles.avatar}>
            <ProfilePhoto src={profile.photoUrl} name={profile.name} />
          </div>
          <div>
            <h2 id="chat-title" className={styles.name}>
              {profile.name}, {profile.age}
            </h2>
            <p className={styles.meta}>
              {profile.city} · {profile.college}
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </header>

      <div className={styles.body}>
        {status === 'loading' && <p className={styles.status}>Loading conversation…</p>}
        {status === 'ready' && messages.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Break the ice with {profile.name}</p>
            <p className={styles.emptyHint}>Tap a starter below or write your own message.</p>
            <div className={styles.openers}>
              {ICEBREAKERS.map((opener) => (
                <button
                  key={opener}
                  type="button"
                  className={styles.opener}
                  disabled={sending}
                  onClick={() => submitText(opener)}
                >
                  {opener}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId !== profile.id;
          return (
            <div key={msg.id} className={classNames(styles.bubbleRow, isMe ? styles.mine : styles.theirs)}>
              <p className={styles.bubble}>{msg.text}</p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder={`Message ${profile.name}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          disabled={sending}
        />
        <Button type="submit" disabled={!draft.trim() || sending}>
          Send
        </Button>
      </form>
    </dialog>
  );
}
