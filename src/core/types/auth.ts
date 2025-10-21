export interface AuthData {
  type: string;
  title: string;
  description: string;
  input: InputData[];
  button: ButtonData;
  email?: string;
  mainRoute?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  selected?: boolean;
}

export interface InputData {
  id?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  name: string;
  error?: string;
  required?: boolean;
  validation?: ValidationData;
  size?: string | number;
  options?: SelectOption[] | Record<string, unknown>;
  multiple?: boolean;
  route?: string;
  accept?: string;
  hidden?: boolean;
  hiddenTarget?: string;
  dependentFields?: string[];
  isCreate?: boolean;
  enableSerialScale?: boolean;
  readonly?: boolean;
  buttonText?: string;
  filterKey?: string;
}

export interface ButtonData {
  text: string;
  url?: string;
  action?: string;
}

export interface ValidationData {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
}

export interface FormDataLogin {
  username: string;
  email: string;
  password: string;
}
