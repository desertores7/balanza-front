"use client";

import React, { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import styles from '@styles/components/Auth.module.scss';
import Checkbox from '@core/components/Inputs/Checkbox';
import Link from 'next/link';
import { FaFacebook, FaGithub, FaGoogle, FaTwitter } from 'react-icons/fa';
import { AuthData } from '../types/auth';
import { IoIosArrowBack } from 'react-icons/io';
import apiClient from '../lib/apiClient';
import { useAuth } from '../store';
import { usePathname, useRouter } from 'next/navigation';
import InputText from './Inputs/InputText';
import Loading from './Loading';
import Lottie from 'lottie-react';
import dots from "../../../public/assets/dots.json";
import { useOfflineAuth } from '../hooks/useOfflineAuth';
import { toast } from 'react-toastify';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    activeUser: number;
    role: string;
    companyUuid: string;
    imgProfile?: {
      url: string;
    };
  };
}

interface AuthFormData {
  [key: string]: string;
}

export default function Auth({ data }: { data: AuthData;}) {
  const { setAuth, setResetEmail, resetEmail, setCodeResetPassword, codeResetPassword, clearResetEmail } = useAuth();
  const { login, isOffline, canUseOffline } = useOfflineAuth();
  const [loading, setLoading] = useState(false);
  const [errorRoot, setErrorRoot] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    onSubmit(formData);
  };

  const onSubmit = async (formData: AuthFormData) => {
    try {
      setLoading(true);
      setErrorRoot(false);

      // Si es login (no reset password), usar el sistema offline
      if (pathname === '/iniciar-sesion' && formData.email && formData.password) {
        try {
          const result = await login(formData.email, formData.password, rememberMe);
          
          if (result.success) {
            if (result.isOffline) {
              toast.warning('Modo offline activado. Funcionalidad limitada.', {
                autoClose: 5000,
              });
            } else {
              toast.success('Login exitoso', {
                autoClose: 2000,
              });
            }
            
            router.push('/pesaje');
            return;
          }
        } catch (offlineError: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error('Error en login offline:', offlineError);
          
          // Si es error de credenciales offline, mostrar mensaje específico
          if (offlineError.message.includes('offline')) {
            toast.error('No hay credenciales guardadas para uso offline. Conecta a internet para hacer login.', {
              autoClose: 5000,
            });
          } else {
            toast.error(offlineError.message || 'Error en el login', {
              autoClose: 3000,
            });
          }
          
          setErrorRoot(true);
          setLoading(false);
          return;
        }
      }

      // Para otros casos (reset password, etc.), usar el sistema original
      let payloadToSend: AuthFormData = formData;

      if (pathname === '/olvidates-tu-contrasena' && formData.email) {
        setResetEmail(formData.email);
        payloadToSend = formData;
      }

      if (pathname === '/validar-codigo') {
        const code = `${formData.code1 || ''}${formData.code2 || ''}${formData.code3 || ''}${formData.code4 || ''}${formData.code5 || ''}${formData.code6 || ''}`;
        setCodeResetPassword(code);
        payloadToSend = { 
          code,
          email: resetEmail || ''
        };
      }

      if (pathname === '/restablecer-contrasena') {
        payloadToSend = {
          password: formData.password,
          email: resetEmail || '',
          code: codeResetPassword || ''
        };
      }

      const res = await apiClient.post(data.button.url as string, payloadToSend);
      const { access_token, refresh_token, user }: LoginResponse = res.data;
      
      // Guardar en el store de Zustand
      if (access_token && refresh_token && user) {
        setAuth(access_token, refresh_token, user, rememberMe);
        
        router.push('/pesaje');
      } else {
        router.push(data.mainRoute as string);
      }
    } catch (err: unknown) {
      console.log((err as Error).message);
      setErrorRoot(true);
      setLoading(false);
    } 
  };


  return (
    <Container fluid className={styles.authContainer}>
      <Row>
        <Col lg={{span:4, offset:4}}>
          <div className={styles.boxContainer}>            
            <Lottie animationData={dots} loop={true} className={`${styles.loadingDots} ${styles.dotsTop}`} />
            <div className={styles.boxComponent}>
            {!loading ?( <>
              <div className={styles.boxLogo}>
                <svg 
              width={100} 
              height={60} 
              viewBox="0 0 413 218" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transition: 'all 0.3s ease' }}
            >
              <path d="M261.79 217.7C253.832 217.724 245.995 215.743 239.005 211.94C232.014 208.137 226.093 202.635 221.79 195.94L206.28 171.94L190.76 195.94C186.449 202.617 180.533 208.107 173.554 211.908C166.574 215.71 158.753 217.702 150.805 217.702C142.857 217.702 135.036 215.71 128.057 211.908C121.077 208.107 115.161 202.617 110.85 195.94L3.00005 28.89C1.17093 26.0633 0.138007 22.7957 0.0100985 19.4312C-0.11781 16.0668 0.664028 12.7301 2.27325 9.77268C3.88248 6.81527 6.25952 4.3466 9.15398 2.62672C12.0484 0.90684 15.3532 -0.000582159 18.72 4.09173e-05H126.87C130.566 -0.00707881 134.205 0.915049 137.451 2.68166C140.698 4.44826 143.449 7.00266 145.45 10.11L206.33 104.36L267.2 10.11C269.202 7.00266 271.952 4.44826 275.199 2.68166C278.445 0.915049 282.084 -0.00707881 285.78 4.09173e-05H393.93C397.292 0.0019545 400.591 0.908693 403.482 2.62511C406.373 4.34153 408.748 6.80435 410.359 9.75515C411.97 12.7059 412.757 16.0359 412.638 19.3957C412.518 22.7555 411.497 26.0211 409.68 28.85L301.76 195.91C297.457 202.605 291.536 208.107 284.546 211.91C277.555 215.713 269.718 217.694 261.76 217.67L261.79 217.7ZM228.15 138.14L252.63 176.05C253.619 177.579 254.976 178.837 256.576 179.707C258.176 180.578 259.969 181.034 261.79 181.034C263.612 181.034 265.404 180.578 267.004 179.707C268.604 178.837 269.961 177.579 270.95 176.05L361 36.67H293.7L228.15 138.14ZM51.68 36.67L141.68 176.05C142.669 177.579 144.026 178.837 145.626 179.707C147.226 180.578 149.019 181.034 150.84 181.034C152.662 181.034 154.454 180.578 156.054 179.707C157.654 178.837 159.011 177.579 160 176.05L184.48 138.14L119 36.67H51.68Z" fill="url(#paint0_linear_2407_4221)"/>
              <defs>
                <linearGradient id="paint0_linear_2407_4221" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0BEEBF" />
                  <stop offset="50%" stopColor="#4C63E3" />
                  <stop offset="100%" stopColor="#0BEEBF" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    values="-0.2,0; 0.2,0; -0.2,0"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
            </svg>
              </div>
              <h1 className={styles.title}>{data.title}</h1>
              <p className={styles.subtitle}>{data.description}</p>
              {errorRoot && (
                <Alert key={'danger'} variant={'danger'} className='mb-0 p-2 text-center'> 
                  Credenciales incorrectas
                </Alert>
              )}
              
              {/* Indicador de estado offline */}
              {pathname === '/iniciar-sesion' && (
                <div className="mb-3">
                  {isOffline ? (
                    <Alert variant="warning" className="mb-2 p-2 text-center">
                      <small>🔌 Sin conexión - Modo offline disponible</small>
                    </Alert>
                  ) : (
                    <Alert variant="success" className="mb-2 p-2 text-center">
                      <small>🌐 Conectado - Funcionalidad completa</small>
                    </Alert>
                  )}
                  
                  {canUseOffline && (
                    <Alert variant="info" className="mb-2 p-2 text-center">
                      <small>💾 Credenciales guardadas para uso offline</small>
                    </Alert>
                  )}
                </div>
              )}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="row-gap-3" style={data.type === 'validarCodigo' ? {justifyContent: 'center',columnGap: '10px'} : {}}>
                  {data.input.map((input, index) => (
                    <InputText
                      inputData={input}
                      key={input.id}
                      value={formData[input.name] || ''}
                      onChange={handleInputChange}
                      autoFocus={data.type === 'validarCodigo'}
                      inputIndex={index + 1}
                      totalInputs={data.input.length}
                      style={data.type === 'validarCodigo' ? {width: '60px', textAlign: 'center', fontSize: '24px'} : {}}                     
                    />
                  ))}
                </Row>
                {(data.type === 'iniciarSesion' || data.type === 'register') && (
                <>
                  <div className={styles.rememberContainer} >
                    <div className={styles.rememberMe}>
                      <Checkbox 
                        checked={rememberMe} 
                        onChange={setRememberMe} 
                      />
                      <p>Recordarme</p>
                    </div>
                    <div>
                      <Link href="/olvidates-tu-contrasena" >Olvidaste tu contraseña?</Link>
                    </div>
                  </div>
                </>
                )}
                <Button type="submit" disabled={loading}> 
                  {loading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                  )}
                  {data.button.text}
                </Button>
                {(data.type === 'register') && (
                  <>
                    <hr />
                    <div className={styles.boxSubRegister}>
                      <FaGoogle />
                      <FaFacebook />
                      <FaTwitter />
                      <FaGithub />
                    </div>
                  </>
                  )}
                {data.type === 'restablecer-contrasena' || data.type === 'olvidaste-tu-contrasena' && (
                  <>
                    <div className={styles.boxButtonBack}>
                        <Link href={'/iniciar-sesion'}><IoIosArrowBack />Volver a iniciar sesión</Link>              
                    </div>
                  </>
                )}
              </Form>
              </>
            ) : (
              <Loading width="100%" height="300px"/>
            )}
            </div>
            <Lottie animationData={dots} loop={true} className={`${styles.loadingDots} ${styles.dotsBottom}`} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

