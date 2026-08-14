import React, { useState, useEffect } from 'react';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import FieldEngineerDashboard from './pages/fieldEngineer/FieldEngineerDashboard';
import GisIntelligence from './pages/gis/GisIntelligence';
import Reports from './pages/reports/Reports';
import Analytics from './pages/analytics/Analytics';
import Assessments from './pages/assessments/Assessments';
import NewAssessment from './pages/assessments/NewAssessment';
import AIProcessing from './pages/aiProcessing/AIProcessing';
import AssessmentResult from './pages/assessmentResult/AssessmentResult';
import Design3D from './pages/design3D/Design3D';
import Settings from './pages/settings/Settings';
import Support from './pages/support/Support';
import ReportPreview from './pages/reportPreview/ReportPreview';
import Toast from './components/common/Toast';
import { api } from './services/api';
import { generateAssessmentPDF } from './services/pdfReport';

function App() {
  const [currentPage, setCurrentPage] = useState('Login');
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('circle-check');

  // Sync body class 'login-mode' to hide shell on Login/Register screens
  useEffect(() => {
    if (currentPage === 'Login' || currentPage === 'Register') {
      document.body.classList.add('login-mode');
    } else {
      document.body.classList.remove('login-mode');
    }
  }, [currentPage]);

  const handleLogin = () => {
    setCurrentPage('Dashboard');
  };

  const triggerToast = (msg, iconName = 'circle-check') => {
    setToastMessage(msg);
    setToastIcon(iconName);
    setToastShow(true);
  };

  useEffect(() => {
    if (toastShow) {
      const timer = setTimeout(() => setToastShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastShow]);

  const handleNewAssessment = () => {
    setCurrentPage('New Assessment');
  };

  const handleQuickAction = (actionKey) => {
    if (actionKey === 'open-map') {
      setCurrentPage('GIS Intelligence');
    } else if (actionKey === 'generate-report') {
      triggerToast('Report generation API offline.', 'circle-alert');
    }
  };

  const handlePageChange = (page) => {
    if (page === 'Login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLatestAssessment(null);
      setSelectedReport(null);
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return (
          <FieldEngineerDashboard
            onNewAssessment={handleNewAssessment}
            onQuickAction={handleQuickAction}
          />
        );
      case 'Assessments':
        return (
          <Assessments
            onNewAssessment={handleNewAssessment}
            onRowClick={(a) => {
              setLatestAssessment(a.raw);
              triggerToast(`Viewing survey ${a.id}...`);
              setCurrentPage('Assessment Result');
            }}
          />
        );
      case 'New Assessment':
        return (
          <NewAssessment
            onCancel={() => setCurrentPage('Dashboard')}
            onSubmit={async (payload) => {
              try {
                triggerToast('Running AI simulation & calculations...', 'loader');
                const result = await api.assessments.create(payload);
                setLatestAssessment(result);
                triggerToast('Assessment submitted successfully.');
                setCurrentPage('AI Processing');
              } catch (err) {
                triggerToast('Submission failed: ' + err.message, 'circle-alert');
              }
            }}
            triggerToast={triggerToast}
          />
        );
      case 'AI Processing':
        return (
          <AIProcessing onViewResults={() => setCurrentPage('Assessment Result')} />
        );
      case 'Assessment Result':
        return (
          <AssessmentResult
            assessment={latestAssessment}
            onReport={() => {
              if (latestAssessment) {
                setSelectedReport({
                  id: `RIN-2026-${String(latestAssessment.assessmentId).padStart(4, '0')}`,
                  building: latestAssessment.buildingName,
                  type: latestAssessment.buildingType,
                  potential: `${Math.round(latestAssessment.harvestPotentialL).toLocaleString()} L`,
                  date: new Date(latestAssessment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                  raw: latestAssessment
                });
              }
              setCurrentPage('Report Preview');
            }}
            onDesign={() => setCurrentPage('3D Design')}
          />
        );
      case '3D Design':
        return (
          <Design3D
            assessment={latestAssessment}
            onReset={() => triggerToast('3D view camera reset.')}
            onFullscreen={() => triggerToast('Entering fullscreen Mode...')}
          />
        );
      case 'GIS Intelligence':
        return (
          <GisIntelligence
            onNewAssessment={handleNewAssessment}
            triggerToast={triggerToast}
          />
        );
      case 'Reports':
        return (
          <Reports
            onExport={() => triggerToast('Data export API currently offline. Operating in preview mode.', 'circle-alert')}
            onReportSelect={(r) => {
              setSelectedReport(r);
              setCurrentPage('Report Preview');
            }}
          />
        );
      case 'Report Preview':
        return (
          <ReportPreview
            report={selectedReport}
            onPrint={() => triggerToast('PDF generation API currently unavailable. Running in preview mode.', 'circle-alert')}
            onDownload={() => {
              if (selectedReport && selectedReport.raw) {
                try {
                  generateAssessmentPDF(selectedReport.raw);
                  triggerToast('Assessment PDF downloaded successfully.');
                } catch (e) {
                  triggerToast(`PDF generation failed: ${e.message}`, 'circle-alert');
                }
              } else {
                triggerToast('No raw assessment data available to generate PDF.', 'circle-alert');
              }
            }}
            onBack={() => setCurrentPage('Reports')}
          />
        );
      case 'Analytics':
        return (
          <Analytics
            onExport={() => triggerToast('Analytics export API currently offline.', 'circle-alert')}
          />
        );
      case 'Settings':
        return (
          <Settings
            onSave={() => triggerToast('Settings saved successfully.')}
            triggerToast={triggerToast}
          />
        );
      case 'Support':
        return (
          <Support
            onNavigate={setCurrentPage}
            triggerToast={triggerToast}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  if (currentPage === 'Login') {
    return <Login onLogin={handleLogin} onRegister={() => setCurrentPage('Register')} triggerToast={triggerToast} />;
  }

  if (currentPage === 'Register') {
    return <Register onLogin={handleLogin} onCancel={() => setCurrentPage('Login')} triggerToast={triggerToast} />;
  }

  return (
    <>
      <DashboardLayout
        currentPage={currentPage}
        onPageChange={handlePageChange}
        triggerToast={triggerToast}
      >
        {renderPage()}
      </DashboardLayout>
      <Toast show={toastShow} message={toastMessage} icon={toastIcon} />
    </>
  );
}

export default App;
