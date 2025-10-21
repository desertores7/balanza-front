"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { InputData } from '@core/types/auth';
import Image from 'next/image';
import { BiUpload } from 'react-icons/bi';

interface PreviewData {
  url?: string;
  type?: string;
}

interface AvatarUploadProps {
  input: InputData;
  value?: string | { url: string; type?: string };
  onChange?: (name: string, value: File) => void;
  isValidated?: boolean;
  className?: string;
}

export default function AvatarUpload({
  input,
  value,
  onChange,
  isValidated = false,
  className = ""
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<PreviewData>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    const file = e.target.files?.[0];
    if (file) {
        // Create a URL for the selected file
        const url = URL.createObjectURL(file);
     
        // Determine if file is image or video based on MIME type
        const fileType = file.type;
        setPreview({url: url, type: fileType}); 
        if (onChange) {
          onChange(input.name, file);
        }
    }
  };

  // Initialize preview with value when component mounts or value changes
  useEffect(() => {
    if (value && typeof value === 'object' && value.url) {
      setPreview({url: value.url, type: value.type});
    }
  }, [value]);





  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const hasError = isValidated && input.required && !preview.url;
  const errorMessage = input.error || input.validation?.message || `${input.label} es requerido`;

  return (
    <div className={`avatar-upload ${className}`}>
      {input.label && (
        <label className="form-label">{input.label}</label>
      )}
      
      <div className="avatar-container" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Avatar Preview */}
        <div 
          className="avatar-preview"
          onClick={handleClick}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '12px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: preview.url ? 'transparent' : '#A78BFA',
            flexShrink: 0
          }}
        >
          {preview.url  ? (
            preview.type === 'image/jpeg' || preview.type === 'image/png' || preview.type === 'image/jpg' ? (
            <Image 
              src={(preview.url)}
              alt="Preview" 
              width={120}
              height={120}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px'
              }}
            />
            ) : (
              <video 
                src={preview.url}
                autoPlay
                muted
                playsInline
                loop
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            )
          ) : (
            <div className="upload-placeholder" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white'
            }}>
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className='d-flex flex-column gap-3'>
          <div className="avatar-controls" style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
            <Button
              type="button"
              onClick={handleClick}
            >
              <BiUpload className='me-1' fontSize={20}/>
              Subir archivo
            </Button>
          </div>
          <p style={{ 
            fontSize: '12px', 
            color: '#6B7280', 
            margin: 0,
            fontFamily: 'inherit'
          }}>
            El archivo debe ser menor a 5mb
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          name={input.name}
          accept={input.accept}
          onChange={handleFileChange}
          required={input.required && preview.url==null}
          style={{ display: 'none' }}
        />
      </div>
      
      {hasError && (
        <div className="invalid-feedback d-block">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
