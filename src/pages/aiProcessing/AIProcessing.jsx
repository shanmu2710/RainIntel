import React from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import AIProcessingProgress from '../../components/aiProcessing/AIProcessingProgress';
import AIProcessingSteps from '../../components/aiProcessing/AIProcessingSteps';

export default function AIProcessing({ onViewResults }) {
  return (
    <div className="processing">
      <PageHeading
        title="Assessment successfully calculated"
        subtitle="Our calculation engine has determined your optimal rooftop recommendation."
      />
      <AIProcessingProgress />
      <AIProcessingSteps />
      <div style={{ marginTop: '24px' }}>
        <Button
          variant="primary"
          icon="arrow-right"
          iconPosition="right"
          onClick={onViewResults}
        >
          View completed results
        </Button>
      </div>
    </div>
  );
}
