import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import PageContainer from '../components/layout/PageContainer';

export default function DashboardLayout({ children, currentPage, onPageChange, triggerToast }) {
  return (
    <>
      <Sidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        triggerToast={triggerToast}
      />
      <main>
        <Navbar
          currentPage={currentPage}
          onPageChange={onPageChange}
          triggerToast={triggerToast}
        />
        <PageContainer>{children}</PageContainer>
      </main>
    </>
  );
}
