"use client";

import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { BiCheck, BiXCircle } from 'react-icons/bi'
import styles from '@styles/components/Modal.module.scss'

export default function CustomModal({ title, children, show, onHide, onConfirm, hideFooter }: { title: string, children: React.ReactNode, show: boolean, onHide: () => void, onConfirm: () => void, hideFooter: boolean  }) {
  const handleClose = () => onHide();
  const handleConfirm = () => onConfirm();
  return (
    <Modal className={styles.modal} show={show} onHide={handleClose}   centered>
        <Modal.Header closeButton>
            <Modal.Title className={styles.modalTitle}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        {!hideFooter && (
        <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              <BiXCircle  className='me-1' fontSize={20}/>
            Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              <BiCheck className='me-1' fontSize={20}/>
                Confirmar
              </Button>
          </Modal.Footer>
        )}
    </Modal>
  )
}
