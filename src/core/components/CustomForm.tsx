"use client";
import React, { useState, useEffect } from 'react'
import styles from '@styles/pages/CreateUser.module.scss'
import InputText from '@/core/components/Inputs/InputText'
import { Col, Row, Spinner, Button, Form, Badge } from 'react-bootstrap';
import Link from 'next/link';
import CustomSelect from '@/core/components/Inputs/CustomSelect';
import AvatarUpload from '@/core/components/Inputs/AvatarUpload';
import CustomDate from '@/core/components/Inputs/CustomDate';
import apiClient from '@/core/lib/apiClient';
import { useRouter } from 'next/navigation';
import Cleave from 'cleave.js/react';
import { CleaveOptions } from 'cleave.js/options';
import { BiSave, BiCategory, BiXCircle, BiDownload,  BiMailSend } from "react-icons/bi";
import { useDynamicDocsFields } from '@/core/hooks/useDynamicDocsFields';
import DigitalCounter from '@/core/components/DigitalCounter';
import { createFormType } from '@/core/types/commonType';
import { InputData } from '@/core/types/auth';
import { useTablesData } from '@core/store/useTablesStore';
import { useAuthStore } from '@/core/store'
import CustomModal from './CustomModal';
import { toast } from 'react-toastify';

interface AuthFormData {
  [key: string]: string | File | Date | null;
}

export default function CustomForm({ data, id }: { data: createFormType; id?: string }) {
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({});
  const [dataEdit, setDataEdit] = useState<AuthFormData>({});
  const [weighingUuid, setWeighingUuid] = useState<string>('');
  const router = useRouter();
  const { fetchAllFiltersData, filtersOptions,  refreshTableData, refreshFilterData} = useTablesData();

console.log("dataEdit", dataEdit)

  const { cleaveOptions, dynamicFields, handleDynamicFieldChange } = useDynamicDocsFields();

  const { user } = useAuthStore()



  const [weight, setWeight] = useState(0)
  const [showModal, setShowModal] = useState(true);
  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight)
  }

  const calculateNetWeight = (inputWeight: number, outputWeight: number) => {
    return outputWeight - inputWeight
  }

  const captureWeight = (fieldName: string) => {
    const newFormData = {
      ...formData,
      [fieldName]: weight.toString()
    }
    
    // Calcular peso neto con los nuevos valores
    const inputWeight = parseFloat(newFormData.inputWeight as string) || 0
    const outputWeight = parseFloat(newFormData.outputWeight as string) || 0
    const netWeight = calculateNetWeight(inputWeight, outputWeight)
    
    // Una sola actualización de estado con todos los valores
    setFormData({
      ...newFormData,
      netWeight: netWeight.toString()
    })
  }



  // Cargar filtros dinámicos cuando se monta el componente
  useEffect(() => {
    fetchAllFiltersData([
      ...(data.cardsAditioonals?.flatMap(card => card.inputs) || []),
      ...data.cards.flatMap(card => card.inputs)
    ]);
  }, [data.cardsAditioonals, fetchAllFiltersData]);

  // Recalcular peso neto cuando cambien los valores manualmente (no por captura)
  useEffect(() => {
    if (formData.inputWeight || formData.outputWeight) {
      const inputWeight = parseFloat(formData.inputWeight as string) || 0
      const outputWeight = parseFloat(formData.outputWeight as string) || 0
      const netWeight = calculateNetWeight(inputWeight, outputWeight)
      
      setFormData(prev => ({
        ...prev,
        netWeight: netWeight.toString()
      }))
    }
  }, [formData.inputWeight, formData.outputWeight]);

  // Función para renderizar el input según su tipo
  const renderInput = (input: InputData) => {
  // Verificar si el campo debe estar oculto
  const isHidden = input.hidden && input.id && !dynamicFields[input.id] && !id;

  if (isHidden) {
    return null; // No renderizar el campo
  }

    switch (input.type) {
      case 'select':
        return (
          <CustomSelect
            input={{
              ...input,
              options: input.filterKey ? filtersOptions[input.filterKey] || [] : input.options
            }}
            defaultValue={dataEdit[input.name] as string | number | undefined}
            onChange={(fieldName, value) => handleFieldChange(fieldName, value as { value: string; label: string } | null)}
            isValidated={validated}
            isEditable={dataEdit?.uuid ? true : false}
          />
        );
      
      case 'file':
        return (
          <AvatarUpload
            input={input}
            value={(formData[input.name] || dataEdit[input.name]) as string | { url: string; type?: string } | undefined}
            onChange={handleFieldChange}
            isValidated={validated}
          />
        );
      
      case 'date':
        return (
          <CustomDate 
            inputData={input}
            value={(formData[input.name] || dataEdit[input.name]) as string}
            onChange={(date: Date | null) => handleFieldChange(input.name, date)}
            isValidated={validated}
          />
        );

        case 'cleave':
          const finalOptions = cleaveOptions[input.name] || input.options;

          return (
            <>
              <Form.Label>{input.label}</Form.Label>
              <Cleave
                key={input.label}
                placeholder={input.placeholder}
                options={finalOptions as CleaveOptions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(input.name, e.target.value)}
                required={input.required}
                name={input.name}
                className="form-control"
                value={(dataEdit[input.name] || '') as string}
                autoComplete="off"
                id={input.id}
              />
            </>
          );
        case 'digitalCounter':
          return (
            <DigitalCounter 
              value={weight} 
              onChange={handleWeightChange} 
              enableSerialScale={input.enableSerialScale || false}
            />
          );
      
      default:
        return (
          <InputText
            inputData={input}
            value={input.id == "WeighingOperator" ? user?.firstName + " " + user?.lastName : (formData[input.name] || dataEdit[input.name]) as string | undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(input.name, e.target.value)}
            isEditable={id ? true : false}
            onButtonClick={input.buttonText ? () => captureWeight(input.name) : undefined}
          />
        );
    }
  };


  // Cargar datos del usuario para editar
  useEffect(() => {
    if (id) {
      const loadUserData = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`${data.mainRoute}/${id}`);
          setDataEdit(response.data);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadUserData();
    }
  }, [id, data.mainRoute]);



  const handleFieldChange = (fieldName: string, value: string | File | Date | null | { value: string; label: string }) => {
    const fieldValue = (value && typeof value === 'object' && 'value' in value) ? value.value : value;

    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
  
    // Llamar al hook para manejar campos dinámicos
    const allInputs = [
      ...data.cards.flatMap(card => card.inputs),
      ...(data.cardsAditioonals || []).flatMap(card => card.inputs)
    ];

    handleDynamicFieldChange(fieldName, value, allInputs, setFormData);

  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;


    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);
    setLoading(true);
    
    try {      
      // Determinar si hay campos de tipo file
      const allInputs: InputData[] = [
        ...data.cards.flatMap(card => card.inputs),
        ...(data.cardsAditioonals || []).flatMap(card => card.inputs)
      ];
      const hasFileFields = allInputs.some((input) => input.type === 'file');

      // Configurar headers según el tipo de contenido
      const headers = hasFileFields 
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };
      
      // Intentar guardar online primero
      try {
        const response = await apiClient[id ? 'put' : 'post'](`${data.routes.save}/${id ? id : ''}`, formData, {
          headers,
        });
        
        if (response.status === 200) {
          toast.success('Los datos se han guardado correctamente');
        } else if(response.status === 201) {
          toast.success('Los datos se han creado correctamente');
        } else {
          toast.error('Ocurrió un error al guardar los datos');
        }
        
        if (data.finalModal) {
          setWeighingUuid(response.data.uuid || dataEdit.uuid);
        }
        if (data.tableKey) {
          refreshTableData(data.routes.mainRoute as string, data.tableKey || '');
          refreshFilterData(data.tableKey || '', data.routes.mainRoute as string);
        }
        
        if (data.finalModal) {
          setShowModal(true);
          return;
        }
        if (data.routes.cancel) {
          router.push(data.routes.cancel);
        }
        
      } catch (networkError: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        // Si falla por red, guardar localmente
        if (!networkError.response) {
          console.log('📴 [FORM] Sin conexión, guardando formulario localmente...');
          console.log('📋 [FORM] Datos del formulario:', formData);
          
          // Guardar en localStorage para sincronizar después
          const offlineData = {
            id: id || `temp_${Date.now()}`,
            formData,
            route: `${data.routes.save}/${id ? id : ''}`,
            method: id ? 'put' : 'post',
            headers,
            timestamp: Date.now(),
            tableKey: data.tableKey
          };
          
          console.log('💾 [FORM] Guardando datos offline:', offlineData);
          
          const existingOfflineData = JSON.parse(localStorage.getItem('offlineForms') || '[]');
          existingOfflineData.push(offlineData);
          localStorage.setItem('offlineForms', JSON.stringify(existingOfflineData));
          
          console.log(`📊 [FORM] Total formularios offline: ${existingOfflineData.length}`);
          
          toast.warning('Sin conexión. Los datos se guardarán cuando se restablezca la conexión.', {
            autoClose: 5000,
          });
          
          // Actualizar datos locales inmediatamente
          if (data.tableKey) {
            const currentData = JSON.parse(localStorage.getItem(`offline_${data.tableKey}`) || '[]');
            currentData.push({ ...formData, id: offlineData.id, _offline: true });
            localStorage.setItem(`offline_${data.tableKey}`, JSON.stringify(currentData));
            
            console.log(`🔄 [FORM] Actualizando tabla local ${data.tableKey} con datos offline`);
            
            // Refrescar tabla con datos locales
            refreshTableData(data.routes.mainRoute as string, data.tableKey || '');
          }
          
          if (data.finalModal) {
            setWeighingUuid(offlineData.id);
            setShowModal(true);
            return;
          }
          if (data.routes.cancel) {
            router.push(data.routes.cancel);
          }
        } else {
          throw networkError; // Re-lanzar si no es error de red
        }
      }
      
    } catch (err: unknown) {
      console.log((err as Error).message);
      toast.error('Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  const downloadWeighing = async (weighingUuid: string) => {
    try {
      const response = await apiClient.post(`/weighings/pdf-invoice/`, { weighingUuid: weighingUuid }, { 
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob' // Importante para manejar archivos binarios
      });

      // Crear un blob con el contenido del PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Crear una URL temporal para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un elemento anchor temporal para descargar
      const link = document.createElement('a');
      link.href = url;
      link.download = `pesaje_${weighingUuid}.pdf`; // Nombre del archivo
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      // Aquí podrías mostrar un toast de error
    }
  }

  const sendEmail = async (weighingUuid: string) => {
    try {
      const response = await apiClient.post(`/weighings/email-invoice/`, { weighingUuid: weighingUuid }, { 
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        toast.success('El email se ha enviado correctamente');
      } else {
        toast.error('Ocurrió un error al enviar el email');
      }
    } catch (error) {
      console.error('Error al enviar el email:', error);
      toast.error('Error al enviar el email');
    }
  }

  return (
    <div className={styles.container}>
      <Form autoComplete="off" noValidate validated={validated} onSubmit={handleSubmit} encType="multipart/form-data">
        <Row className="row-gap-3">          
            <Col lg={8}>
              <div className={styles.card}>
              {data?.cards?.map((card, cardIndex) => (
                <div className={styles.cardInner} key={cardIndex}>
                  <h2 className={styles.titleTable}><card.icon fontSize={25} color="var(--primary)"/>{id ? card.editTitle : card.createTitle}</h2>
                  <Row className="row-gap-3">
                    {card.inputs.map((input, index) => (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <Col key={index} lg={input.size as any}>{renderInput(input)}</Col>
                    ))}
                  </Row>
                </div>
              ))}
              </div>
            </Col>
            <Col lg={4}>
            {data?.cardsAditioonals && (
              <div className={styles.card}>
                {data?.cardsAditioonals?.map((card, cardIndex) => (
                  <div className={styles.cardInner} key={cardIndex}>
                    <h2 className={styles.titleTable}><card.icon fontSize={25} color="var(--primary)"/>{id ? card.aditionalEditTitle : card.aditionalCreateTitle}</h2>
                    <Row className="row-gap-3">
                      {card.inputs.map((input, index) => (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <Col key={index} lg={input.size as any}>{renderInput(input)}</Col>
                      ))}
                    </Row>
                  </div>
                ))}
              </div>
              )}
              {data.mainRoute == '/weighings' && dataEdit?.uuid && (
                <div className={styles.cardInner}>
                  <h2 className={styles.titleTable}><BiCategory  fontSize={25} color="var(--primary)"/>Estado de Pesaje</h2>
                  <Badge bg="warning" style={{ fontSize: "15px" }}>
                    {dataEdit.inputWeight && dataEdit.outputWeight ? 'Cerrado' : 'Pendiente'}
                  </Badge>
                </div>
              ) }
              <div className={styles.cardInner}>
                <h2 className={styles.titleTable}><BiCategory  fontSize={25} color="var(--primary)"/>Acciones</h2>
                <div className={styles.cardButtons}>
                  <Button  type="submit" disabled={loading} > 
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
                    <BiSave className='me-1' fontSize={20}/>
                    Guardar
                  </Button>
                    <Link href={data.routes.cancel || '/'} className="btn btn-danger">
                    <BiXCircle  className='me-1' fontSize={20}/>
                          Cancelar
                  </Link>
                </div>
              </div>
            </Col>

        </Row>
      </Form>
      {data.finalModal && showModal && weighingUuid &&(
      <CustomModal 
        title="Pesaje finalizado" 
        show={showModal} 
        onConfirm={() => {setShowModal(false);}}
        onHide={() => {setShowModal(false);router.push(data.routes.cancel as string)}} 
        hideFooter={true}
      >
        <div className={"modal-weighing-final"}>
          <p className="mb-2"><b>Descargar informe de pesaje</b></p>
          <Button variant="primary" className="mb-3" onClick={() => {downloadWeighing(weighingUuid)}}>
            <BiDownload className='me-1' fontSize={20}/>
            Descargar
          </Button>
          <p className="mb-2"><b>Enviar por email al Cliente</b></p>
          <Button variant="primary" className="mb-2" onClick={() => {sendEmail(weighingUuid)}}>
            <BiMailSend className='me-1' fontSize={20}/>
            Enviar por email
          </Button>
        </div>
      </CustomModal>
      )}
    </div>
  )
}
