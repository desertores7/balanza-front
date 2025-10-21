import type { AuthData } from '@/core/types/auth';

export const login: AuthData = {
  type: 'iniciarSesion',
  title: 'Bienvenido a WeightFlow! 👋🏻',
  description: 'Por favor, inicia sesión en tu cuenta y comienza la aventura',
  mainRoute: '/iniciarSesion',
  input : [
    {
      id: 'loginUsername',
      label: 'Email',
      type: 'email',
      placeholder: 'Ingresa tu email',
      name: 'email',
      error: 'El email es requerido',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 20,
        pattern: '^[a-zA-Z0-9_]+$',
        message: 'El email debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos'
      }
    },
    {
      id: 'loginPassword',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Ingresa tu contraseña',
      name: 'password',
      error: 'La contraseña es requerida',
      required: true,
      validation: {
        minLength: 6,
        maxLength: 20,
        pattern: '^[a-zA-Z0-9_]+$',
        message: 'La contraseña debe tener entre 6 y 20 caracteres y solo puede contener letras, números y guiones bajos' 
      }
    }
  ],
  button: {
    text: 'Iniciar sesión',
    url: '/auth/login',
  },
};

// export const register: AuthData = {
//   type: 'register',
//   title: 'Adventure starts here 🚀',
//   description: 'Make your app management easy and fun!',
//   input: [
//     {
//       id: 'registerUsername',
//       label: 'Username',
//       type: 'text',
//       placeholder: 'Enter your username',
//       name: 'registerUsername',
//       error: 'Username is required',
//       required: true,
//       validation: {
//         minLength: 3,
//         maxLength: 20,
//         pattern: '^[a-zA-Z0-9_]+$',
//         message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
//       }
//     },
//     {
//       id: 'registerEmail',
//       label: 'Email',
//       type: 'email',
//       placeholder: 'Enter your email',
//       name: 'registerEmail',
//       error: 'Email is required',
//       required: true,
//       validation: {
//         pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
//         message: 'Please enter a valid email address'
//       }
//     },
//     {
//       id: 'registerPassword',
//       label: 'Password',
//       type: 'password',
//       placeholder: 'Enter your password',
//       name: 'registerPassword',
//       error: 'Password is required',
//       required: true,
//       validation: {
//         minLength: 6,
//         message: 'Password must be at least 6 characters'
//       }
//     },
//     {
//       id: 'registerConfirmPassword',
//       label: 'Confirm Password',
//       type: 'password',
//       placeholder: 'Confirm your password',
//       name: 'registerConfirmPassword',
//       error: 'Password is required',
//       required: true,
//       validation: {
//         minLength: 6,
//         message: 'Password must be at least 6 characters'
//       }
//     }
//   ],
//   button: {
//     text: 'Sign Up',
//     url: '/users',
//   },
// };

export const forgotPassword: AuthData = {
  type: 'olvidasteTuContrasena',
  title: 'Olvidaste tu contraseña? 🔒',
  description: 'No te preocupes, te enviaremos instrucciones para restablecer tu contraseña.',
  mainRoute: '/validar-codigo',
  input: [
    {
      id: 'forgotEmail',
      label: 'Email',
      type: 'email',
      placeholder: 'Ingresa tu email',
      name: 'email',
      error: 'El email es requerido',
      required: true,
      validation: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        message: 'Por favor, ingresa un email válido'
      }
    }
  ],
  button: {
    text: 'Restablecer contraseña',
    url: '/auth/send-reset-password',
  },
};

export const resetPassword: AuthData = {
  type: 'restablecerContrasena',
  title: 'Restablecer contraseña 🔑',
  description: 'Ingresa tu nueva contraseña a continuación.',
  mainRoute: '/iniciar-sesion',
  input: [
    {
      id: 'resetPassword',
      label: 'Nueva contraseña',
      type: 'password',
      placeholder: 'Ingresa tu nueva contraseña',
      name: 'password',
      error: 'La contraseña es requerida',
      required: true,
      validation: {
        minLength: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      }
    },
    // {
    //   id: 'resetConfirmPassword',
    //   label: 'Confirmar nueva contraseña',
    //   type: 'password',
    //   placeholder: 'Confirmar tu nueva contraseña',
    //   name: 'confirmPassword',
    //   error: 'La contraseña es requerida',
    //   required: true,
    //   validation: {
    //     minLength: 6,
    //     message: 'La contraseña debe tener al menos 6 caracteres'
    //   }
    // }
  ],
  button: {
    text: 'Actualizar contraseña',
    url: '/auth/reset-password',
  },
};

export const verifyEmail: AuthData = {
  type: 'validarCodigo',
  title: 'Validar código',
  description: 'Ingresa el código de verificación que te hemos enviado a tu email.',
  mainRoute: '/restablecer-contrasena',
  input: [
    {
      id: 'code1',
      // label: 'Código de verificación',
      type: 'text',
      placeholder: '-',
      name: 'code1',
      error: 'El código es requerido',
      // required: true,
      validation: {
        minLength: 1,
        maxLength: 1,
        // message: 'El código debe tener al menos 6 caracteres'
      }
    },
    {
      id: 'code2',
      // label: 'Código de verificación',
      type: 'text',
      placeholder: '-',
      name: 'code2',
      error: 'El código es requerido',
      // required: true,
      validation: {
        minLength: 1,
        maxLength: 1,
        // message: 'El código debe tener al menos 6 caracteres'
      }
    }
    ,{
      id: 'code3',
      // label: 'Código de verificación',
      type: 'text',
      placeholder: '-',
      name: 'code3',
      error: 'El código es requerido',
      // required: true,
      validation: {
        minLength: 1,
        maxLength: 1,
        // message: 'El código debe tener al menos 6 caracteres'
      }
    },
    {
      id: 'code4',
      // label: 'Código de verificación',
      type: 'text',
      placeholder: '-',
      name: 'code4',
      error: 'El código es requerido',
      // required: true,
      validation: {
        minLength: 1,
        maxLength: 1,
        // message: 'El código debe tener al menos 6 caracteres'
      }
    },
    {
      id: 'code5',
      // label: 'Código de verificación',
      type: 'text',
      placeholder: '-',
      name: 'code5',
      error: 'El código es requerido',
      // required: true,
      validation: {
        minLength: 1,
        maxLength: 1,
        // message: 'El código debe tener al menos 6 caracteres'
      }
    },
    {
      id: 'code6',
      // label: 'Código de verificación',
      type: 'text',
      placeholder: '-',
      name: 'code6',
      error: 'El código es requerido',
      // required: true,
      validation: {
        minLength: 1,
        maxLength: 1,
        // message: 'El código debe tener al menos 6 caracteres'
      }
    }
  ],
  button: {
    text: 'Validar código',
    url: '/auth/validate-code',
  },
};
