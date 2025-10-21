/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRef, useState, useCallback, useEffect } from 'react'

/* ==== Tipos mínimos Web Serial (TS) ==== */
declare global {
  interface SerialPort {
    readable: ReadableStream<Uint8Array> | null;
    writable: WritableStream<Uint8Array> | null;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
    getInfo?: () => { usbVendorId?: number; usbProductId?: number };
  }
  interface SerialOptions {
    baudRate: number;
    dataBits?: 7 | 8;
    stopBits?: 1 | 2;
    parity?: "none" | "even" | "odd";
    bufferSize?: number;
    flowControl?: "none" | "hardware";
  }
  interface Navigator {
    serial: {
      requestPort(opts?: { filters?: Array<{ usbVendorId?: number; usbProductId?: number }> }): Promise<SerialPort>;
      getPorts(): Promise<SerialPort[]>;
      addEventListener(type: "connect" | "disconnect", listener: any): void;
      removeEventListener(type: "connect" | "disconnect", listener: any): void;
    };
  }
}

type SerialPortLike = SerialPort & {
  setSignals?: (signals: { dataTerminalReady?: boolean; requestToSend?: boolean }) => Promise<void>;
};

const supportsWebSerial = typeof navigator !== "undefined" && "serial" in (navigator as any);

/* ==== Configuración La Torre ==== */
const BAUD = 1200;
const DATABITS: 7 | 8 = 7;
const PARITY: "none" | "even" | "odd" = "none";
const STOPBITS: 1 | 2 = 1;
const DELIM = "\r";

/* ==== Utils ==== */
function makeLineTransformer(delimiter = "\r") {
  let buffer = "";
  return new TransformStream<string, string>({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(delimiter);
      buffer = parts.pop() ?? "";
      for (const p of parts) controller.enqueue(p);
    },
    flush(controller) {
      if (buffer) controller.enqueue(buffer);
    }
  });
}

function modeStr() {
  const p = PARITY === "none" ? "N" : PARITY === "even" ? "E" : "O";
  return `${DATABITS}${p}${STOPBITS}`;
}

/* ==== Parser específico La Torre ==== */
function parseLaTorre(rawIn: string): { ok: boolean; raw: string; kg?: number } {
  const raw = rawIn.trim();
  const m = raw.match(/^D(\d{6})$/i);
  if (!m) return { ok: false, raw };
  const grams = Number(m[1]);
  if (!Number.isFinite(grams)) return { ok: false, raw };
  return { ok: true, raw, kg: grams / 1000 };
}

export interface UseSerialScaleReturn {
  isConnected: boolean;
  isConnecting: boolean;
  weight: number;
  rawData: string;
  status: string;
  portInfo: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
}

// Función para limpiar completamente la conexión global
export function clearGlobalSerialConnection() {
  globalKeepRef = false;
  
  // Limpiar reader global
  if (globalReaderRef) {
    try {
      globalReaderRef.releaseLock();
    } catch (err) {
      console.log("Error liberando reader global:", err);
    }
    globalReaderRef = null;
  }
  
  
  // Resetear estados globales
  globalIsConnected = false;
  globalIsConnecting = false;
}

// Variables globales para mantener la conexión entre componentes
let globalPortRef: SerialPortLike | null = null;
let globalReaderRef: ReadableStreamDefaultReader<string> | null = null;
let globalKeepRef = false;
let globalIsConnected = false;
let globalIsConnecting = false;

// Variables globales para datos en tiempo real
let globalWeight = 0;
let globalRawData = "";
let globalStatus = supportsWebSerial ? "Listo para conectar" : "Web Serial no soportado";
const globalPortInfo = "—";
const globalError: string | null = null;

export function useSerialScale(): UseSerialScaleReturn {
  const [isConnected, setIsConnected] = useState(globalIsConnected);
  const [isConnecting, setIsConnecting] = useState(globalIsConnecting);
  const [weight, setWeight] = useState<number>(globalWeight);
  const [rawData, setRawData] = useState<string>(globalRawData);
  const [status, setStatus] = useState<string>(globalStatus);
  const [portInfo, setPortInfo] = useState<string>(globalPortInfo);
  const [error, setError] = useState<string | null>(globalError);
  const [autoConnect, setAutoConnect] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);

  const portRef = useRef<SerialPortLike | null>(globalPortRef);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(globalReaderRef);
  const keepRef = useRef<boolean>(globalKeepRef);

  // Sincronizar datos globales con estado local
  useEffect(() => {
    const syncData = () => {
      if (globalRawData !== rawData) {
        setRawData(globalRawData);
      }
      if (globalWeight !== weight) {
        setWeight(globalWeight);
      }
      if (globalStatus !== status) {
        setStatus(globalStatus);
      }
      if (globalPortInfo !== portInfo) {
        setPortInfo(globalPortInfo);
      }
      if (globalError !== error) {
        setError(globalError);
      }
      if (globalIsConnected !== isConnected) {
        setIsConnected(globalIsConnected);
      }
      if (globalIsConnecting !== isConnecting) {
        setIsConnecting(globalIsConnecting);
      }
    };

    // Sincronizar inmediatamente
    syncData();

    // Sincronizar periódicamente
    const interval = setInterval(syncData, 100);
    
    return () => clearInterval(interval);
  }, [rawData, weight, status, portInfo, error, isConnected, isConnecting]);

  const openPort = useCallback(async (port: SerialPortLike) => {
    try { 
      readerRef.current?.releaseLock(); 
    } catch {}
    
    // Verificar si el puerto ya está abierto
    try {
      // Intentar cerrar el puerto si está abierto
      await port.close?.(); 
    } catch (err: any) {
      // Si no se puede cerrar, probablemente ya está cerrado
      if (err.message?.includes("already closed")) {
        console.log("Puerto ya estaba cerrado");
      } else {
        console.log("Puerto ya cerrado o no estaba abierto:", err.message);
      }
    }
    
    await new Promise(r => setTimeout(r, 100));

    try {
      await port.open({
        baudRate: BAUD,
        dataBits: DATABITS,
        parity: PARITY,
        stopBits: STOPBITS,
        flowControl: "none"
      });
    } catch (err: any) {
      if (err.message?.includes("already open")) {
        console.log("Puerto ya está abierto, continuando...");
        // El puerto ya está abierto, continuar
      } else {
        throw err;
      }
    }
    
    if (port.setSignals) {
      await port.setSignals({ dataTerminalReady: true, requestToSend: true });
    }
    await new Promise(r => setTimeout(r, 40));
  }, []);

  const describePort = useCallback((p: SerialPort) => {
    try {
      const info = (p.getInfo?.() ?? {}) as any;
      const toHex = (n: number) => "0x" + (n >>> 0).toString(16).toUpperCase().padStart(4, "0");
      const vid = info.usbVendorId ? `VID ${toHex(info.usbVendorId)}` : "";
      const pid = info.usbProductId ? `PID ${toHex(info.usbProductId)}` : "";
      return [vid, pid].filter(Boolean).join(" ");
    } catch { 
      return "—"; 
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      if (!supportsWebSerial) {
        throw new Error("Navegador sin Web Serial");
      }

      // Si ya hay un puerto abierto, solo verificar que esté funcionando
      if (portRef.current && portRef.current.readable && readerRef.current) {
        setIsConnected(true);
        setStatus("Reutilizando conexión existente...");
        return;
      }

      setIsConnecting(true);
      setError(null);
      setStatus("Selecciona el puerto (La Torre)...");
      
      // Intentar usar puertos ya autorizados primero
      let port: SerialPort;
      try {
        const ports = await navigator.serial.getPorts();
        if (ports.length > 0) {
          // Usar el primer puerto disponible
          port = ports[0];
          setStatus("Conectando con puerto autorizado...");
        } else {
          // Si no hay puertos autorizados, pedir selección manual
          port = await navigator.serial.requestPort();
          setStatus("Conectando con puerto seleccionado...");
        }
      } catch (err) {
        // Si falla, pedir selección manual
        port = await navigator.serial.requestPort();
        setStatus("Conectando con puerto seleccionado...");
      }
      
      portRef.current = port as SerialPortLike;
      globalPortRef = portRef.current;
      setPortInfo(describePort(portRef.current));

      setStatus(`Abriendo @ ${BAUD} ${modeStr()}…`);
      await openPort(portRef.current);

      // Verificar que el puerto tenga readable stream
      if (!portRef.current.readable) {
        throw new Error("Puerto no tiene stream de lectura disponible");
      }

      // Verificar que no haya un reader activo
      if (readerRef.current) {
        setIsConnected(true);
        setIsConnecting(false);
        setStatus("Conectado (reutilizando reader)");
        return;
      }

      const decoder = new TextDecoderStream("ascii", { fatal: false, ignoreBOM: true });
      const lined = portRef.current.readable
        .pipeThrough(decoder as any)
        .pipeThrough(makeLineTransformer(DELIM));
      const reader = lined.getReader();
      readerRef.current = reader;
      globalReaderRef = reader;

      keepRef.current = true;
      globalKeepRef = true;
      setIsConnected(true);
      globalIsConnected = true;
      setIsConnecting(false);
      globalIsConnecting = false;
      setStatus(`Conectado y leyendo… (${BAUD} ${modeStr()})`);
      globalStatus = `Conectado y leyendo… (${BAUD} ${modeStr()})`;

      // Loop de lectura
      (async () => {
        try {
          while (keepRef.current) {
            // Verificar si debe detenerse antes de leer
            if (!keepRef.current) break;
            
            const { value, done } = await reader.read();
            if (done || !keepRef.current) break;
            if (typeof value !== "string") continue;

            const raw = value.trim();
            if (!raw) continue;
            setRawData(raw);
            globalRawData = raw;

            const res = parseLaTorre(raw);
            if (res.ok && typeof res.kg === "number") {
              setWeight(res.kg);
              globalWeight = res.kg;
            }
          }
        } catch (e) {
          if (keepRef.current) {
            setError(`Error de lectura: ${String(e)}`);
            // Si hay error y keepRef sigue activo, mantener conexión
            console.log("Error en loop de lectura, pero manteniendo conexión");
          }
        } finally {
          // Solo desconectar si keepRef se estableció en false intencionalmente
          if (!keepRef.current) {
            console.log("Desconectando por keepRef = false");
            setIsConnected(false);
            setStatus("Desconectado");
          }
        }
      })();

    } catch (e: any) {
      setError(e?.message ?? e);
      setStatus(`Error: ${e?.message ?? e}`);
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [openPort, describePort]);

  const disconnect = useCallback(async () => {
    
    // Detener el loop de lectura
    keepRef.current = false;
    
    // Esperar un momento para que el loop termine
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Liberar el reader primero
    try { 
      if (readerRef.current) {
        await readerRef.current.releaseLock();
      }
    } catch (err) {
      console.log("Error liberando reader:", err);
    } finally {
      readerRef.current = null;
    }
    
    
    // Actualizar estados pero mantener puerto abierto
    setIsConnected(false);
    globalIsConnected = false;
    setIsConnecting(false);
    globalIsConnecting = false;
    setStatus("Puerto abierto pero sin lectura activa");
    // NO resetear portInfo para mantener información del puerto
    setWeight(0);
    setRawData("");
    setError(null);
    
  }, []);

  // NO conectar automáticamente - solo permitir conexión manual
  useEffect(() => {
    // Solo establecer el estado inicial
    if (!isConnected && !isConnecting) {
      setStatus("Presione 'Conectar Balanza' para autorizar el puerto");
      globalStatus = "Presione 'Conectar Balanza' para autorizar el puerto";
    }
  }, []);

  // NO reconectar automáticamente - solo permitir conexión manual
  // useEffect de reconexión automática deshabilitado

  // Resetear intentos de reconexión cuando se conecta exitosamente
  useEffect(() => {
    if (isConnected) {
      setReconnectAttempts(0);
    }
  }, [isConnected]);

  // Cleanup al desmontar - NO limpiar la conexión global ni cerrar puerto
  useEffect(() => {
    return () => {
      // NO limpiar la conexión global, NO cerrar puerto, solo limpiar referencias locales
      setWeight(0);
      setRawData("");
      setError(null);
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    weight,
    rawData,
    status,
    portInfo,
    connect,
    disconnect,
    error
  };
}
