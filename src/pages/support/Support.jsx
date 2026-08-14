import React, { useState } from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import SupportSearch from '../../components/support/SupportSearch';
import SupportCategoryCard from '../../components/support/SupportCategoryCard';
import FAQList from '../../components/support/FAQList';
import ContactSupport from '../../components/support/ContactSupport';

export default function Support({ onNavigate, triggerToast }) {
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    if (e.target.value.trim() !== '') {
      setActiveCategory(null); // Return to universal search view
    }
  };

  const categories = [
    {
      id: 'Getting started',
      icon: 'book-open',
      iconColor: 'teal',
      title: 'Getting started',
      desc: 'Learn the assessment workflow, location capture, and AI review process.',
    },
    {
      id: 'Assessments',
      icon: 'clipboard-list',
      iconColor: 'green',
      title: 'Assessments',
      desc: 'Understand statuses, roof measurements, and history.',
    },
    {
      id: 'GIS & location help',
      icon: 'map',
      iconColor: 'blue',
      title: 'GIS & location help',
      desc: 'Resolve GPS accuracy, map layers, satellite imagery, and boundary issues.',
    },
    {
      id: '3D Design',
      icon: 'box',
      iconColor: 'purple',
      title: '3D Design',
      desc: 'Explore the data-driven interactive RWH visualizations.',
    },
    {
      id: 'Analytics',
      icon: 'bar-chart-2',
      iconColor: 'amber',
      title: 'Analytics & Reports',
      desc: 'View district rankings, KPI summaries, and export capabilities.',
    },
    {
      id: 'Settings',
      icon: 'user',
      iconColor: 'gray',
      title: 'Account / Settings',
      desc: 'Manage local preferences and offline settings.',
    }
  ];

  const supportDatabase = [
    {
      category: 'Getting started',
      question: 'How do I create a new building assessment?',
      answer: 'Click "New assessment" from the dashboard. You will need to enter building information, roof material, and capture location coordinates. The calculation runs immediately upon submission.',
      route: 'New Assessment'
    },
    {
      category: 'Getting started',
      question: 'How is the Rainwater Harvesting (RWH) potential calculated?',
      answer: 'The existing AI calculation workflow projects potential volume by combining the physical roof area captured against standard runoff coefficients and regional rainfall data estimates.'
    },
    {
      category: 'Assessments',
      question: 'How do I view my previous assessments?',
      answer: 'Navigate to the Assessments table to see a historical list of all records and click any row to review its calculation statuses (such as Submitted, Processing, or Completed).',
      route: 'Assessments'
    },
    {
      category: 'Assessments',
      question: 'What does the Confidence Score imply?',
      answer: 'The confidence score represents the internal certainty of the RainIntel AI calculation workflow based on the completeness of your currently submitted variables. It is not an absolute accuracy guarantee.'
    },
    {
      category: 'GIS & location help',
      question: 'Can the GIS automatically capture exact roof dimensions?',
      answer: 'No. The GIS capability retrieves soil data, grid references, coordinates, and district limits from the provided latitude and longitude. Roof areas must be provided manually during the assessment phase.'
    },
    {
      category: 'GIS & location help',
      question: 'How do I troubleshoot GIS map coordinate inaccuracies?',
      answer: 'Ensure browser location permissions are granted. GIS intelligence relies directly on the actual GPS coordinates submitted during the assessment.',
      route: 'GIS Intelligence'
    },
    {
      category: '3D Design',
      question: 'Are the 3D models certified engineering drawings?',
      answer: 'No. The 3D view is an interactive, data-driven visualization generated directly from the variables inside the assessment (e.g. roof area and recharge recommendation). It is a preliminary visualization, not an exact construction blueprint.',
      route: '3D Design'
    },
    {
      category: 'Analytics',
      question: 'Where can I find district rankings and KPI records?',
      answer: 'All macro intelligence and district analytics (harvest potential, total assessments) are available within the Analytics view.',
      route: 'Analytics'
    },
    {
      category: 'Analytics',
      question: 'How do I export PDF Reports?',
      answer: 'From the Reports view, select an assessment and click Print or Download to generate an official offline PDF layout of the RWH summary.',
      route: 'Reports'
    },
    {
      category: 'Settings',
      question: 'Why are some Settings options labeled "Saved on this device"?',
      answer: 'Local interface layout, sizing, and theme preferences are preserved using frontend storage protocols. User Profile details or API account integrations remain strictly controlled by the central server.',
      route: 'Settings'
    }
  ];

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    setSearchVal('');
  };

  // Compute Active FAQ Logic
  let activeArticles = supportDatabase;
  if (searchVal.trim() !== '') {
    activeArticles = supportDatabase.filter(art => 
      art.question.toLowerCase().includes(searchVal.toLowerCase()) ||
      art.answer.toLowerCase().includes(searchVal.toLowerCase()) || 
      art.category.toLowerCase().includes(searchVal.toLowerCase())
    );
  } else if (activeCategory) {
    activeArticles = supportDatabase.filter(art => art.category === activeCategory);
  } else {
    // Show top questions by default
    activeArticles = supportDatabase.slice(0, 5);
  }

  return (
    <>
      <PageHeading
        title="Support center"
        subtitle="Guides, assistance, and field-engineer resources."
      />

      <SupportSearch value={searchVal} onChange={handleSearch} />

      {!activeCategory && searchVal === '' ? (
        <div className="support-grid">
          {categories.map((cat, index) => (
            <SupportCategoryCard
              key={index}
              {...cat}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>
      ) : (
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant="secondary" icon="arrow-left" onClick={() => { setActiveCategory(null); setSearchVal(''); }}>
            Back to categories
          </Button>
          <span style={{ fontWeight: 600, color: '#334155', fontSize: '15px' }}>
            {searchVal !== '' ? 'Search Results' : activeCategory}
          </span>
        </div>
      )}

      <div className="content-grid" style={{ marginTop: '17px' }}>
        <FAQList 
          articles={activeArticles} 
          onNavigate={onNavigate} 
          title={searchVal !== '' ? `Results for "${searchVal}"` : (activeCategory ? `${activeCategory} FAQs` : 'Popular articles')} 
          subtitle={searchVal !== '' ? '' : (activeCategory ? 'Related support content' : 'Most useful for field engineers')}
        />
        
        {/* Render Contact Card un-conditionally to provide fallback utility */}
        <ContactSupport triggerToast={triggerToast} onCancel={() => {}} />
      </div>
    </>
  );
}
