import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import LucideIcon from '../common/LucideIcon';

export default function FAQList({ articles, onNavigate, title = 'Popular articles', subtitle = 'Most useful for field engineers' }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const defaultArticles = [
    { question: 'How to capture an accurate rooftop GPS location', answer: 'Ensure you are standing on the property and have granted GPS permissions to the browser. The system will ping your precise coordinates for accuracy.' },
    { question: 'Understanding analysis confidence and recommendation scores', answer: 'Confidence scores represent the algorithm\'s certainty based on current inputs, not an absolute guarantee of results. Confidence reflects the availability of GIS/soil assessment data.' },
    { question: 'Required photos for a complete rooftop survey', answer: 'Capture clear images of the entire building, the exact rooftop surface, and the surrounding site.' },
    { question: 'How rainwater potential is calculated', answer: 'Potential is projected automatically via the existing RainIntel logic combining roof area, runoff properties, and regional rainfall data.' },
    { question: 'Exporting a signed assessment report', answer: 'Visit the Reports tab to select an assessment and generate the official PDF.' },
  ];

  const list = articles && articles.length > 0 ? articles : (articles && articles.length === 0 ? [] : defaultArticles);

  return (
    <Card>
      <div className="card-title">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      
      {list.length === 0 ? (
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
          No support articles found.
        </div>
      ) : (
        <ul className="support-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {list.map((article, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <li
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px 0',
                  borderBottom: '1px solid #e2e8f0',
                  cursor: 'pointer'
                }}
              >
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontWeight: isExpanded ? 600 : 400, color: '#0f172a' }}
                  onClick={() => toggleAccordion(index)}
                >
                  <span style={{ fontSize: '14px', lineHeight: 1.4 }}>{typeof article === 'string' ? article : article.question}</span>
                  <LucideIcon name={isExpanded ? "chevron-down" : "chevron-right"} style={{ minWidth: '16px', color: '#64748b' }} />
                </div>
                
                {isExpanded && typeof article !== 'string' && (
                  <div style={{ marginTop: '10px', fontSize: '13px', color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
                    <p style={{ margin: '0 0 10px 0' }}>{article.answer}</p>
                    
                    {article.route && onNavigate && (
                      <Button variant="secondary" icon="arrow-right" iconPosition="right" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(article.route);
                      }}>
                        Go to {article.route}
                      </Button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
