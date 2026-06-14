'use client';

import { useState, useTransition, useRef } from 'react';
import { submitCheckIn } from '@/app/actions/checkin';
import styles from './CheckInUploader.module.css';

interface CheckInUploaderProps {
  matchId: string;
}

export function CheckInUploader({ matchId }: CheckInUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'El archivo debe ser una imagen.' });
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Debes seleccionar una foto primero.' });
      return;
    }
    
    setMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('match_id', matchId);
      formData.append('photo', file);

      const result = await submitCheckIn(formData);
      
      if (result?.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: '¡Check-in subido con éxito! Pendiente de aprobación.' });
        setFile(null);
        setPreview(null);
      }
    });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {preview ? (
        <div className={styles.previewContainer}>
          <div className={styles.previewImage} style={{ backgroundImage: `url(${preview})` }} />
          <button 
            type="button" 
            className={styles.changeBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            Cambiar Foto
          </button>
        </div>
      ) : (
        <div 
          className={styles.uploadBox} 
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={styles.uploadIcon}>📸</span>
          <p>Toca para seleccionar o tomar una foto</p>
        </div>
      )}

      {file && (
        <button 
          type="submit" 
          className={styles.submitBtn} 
          disabled={isPending}
        >
          {isPending ? 'Subiendo...' : 'Enviar Check-in'}
        </button>
      )}

      {message && (
        <div className={`${styles.message} ${message.type === 'error' ? styles.error : styles.success}`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
