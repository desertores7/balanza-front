"use client";
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import Sidebar from '@/core/components/Sidebar';
import ThemeProvider from "@components/ThemeProvider";
import Navbar from '@/core/components/Nav/Navbar';
import MobileWarning from '@/core/components/MobileWarning';
import styles from '@/core/styles/components/SidebarLayout.module.scss';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MobileWarning />
      <Container fluid className={styles.dashboardContainer}>
        <Row>
          <Col xs="auto" className='p-0'>
            <Sidebar/>
          </Col>
          <Col className='px-4'> 
            <Navbar/>
            {children}
          </Col>
        </Row>
      </Container>
    </ThemeProvider>
  )
}
