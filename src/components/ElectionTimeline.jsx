import React, { useState } from 'react';
import { FaRegIdCard, FaBullhorn, FaVoteYea, FaChartPie } from 'react-icons/fa';
import './ElectionTimeline.css';

const steps = [
  {
    id: 1,
    title: 'Voter Registration',
    icon: <FaRegIdCard />,
    description: 'The first step is ensuring you are registered to vote. Check your local guidelines for deadlines and requirements.',
    details: <>You can usually register online, by mail, or in person. You will need proof of identity and residence. <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-color)', textDecoration: 'underline'}}>https://voters.eci.gov.in/</a></>
  },
  {
    id: 2,
    title: 'Campaigning',
    icon: <FaBullhorn />,
    description: 'Candidates campaign to share their platforms and debate key issues before election day.',
    details: 'Stay informed by reading about candidates, attending town halls, or watching debates.'
  },
  {
    id: 3,
    title: 'Election Day',
    icon: <FaVoteYea />,
    description: 'Cast your ballot at your designated polling station or via mail-in voting if applicable.',
    details: 'Remember to bring accepted ID if required in your area. If you are in line when polls close, stay in line!'
  },
  {
    id: 4,
    title: 'Results & Declaration',
    icon: <FaChartPie />,
    description: 'Votes are counted, and the official results are declared by the electoral commission.',
    details: 'Results may take hours or days depending on the voting method and closeness of the race.'
  }
];

const ElectionTimeline = () => {
  const [activeStep, setActiveStep] = useState(null);

  const handleStepClick = (index) => {
    setActiveStep(activeStep === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStepClick(index);
    }
  };

  return (
    <section className="timeline-container glass-panel" id="timeline" aria-labelledby="timeline-heading">
      <h2 id="timeline-heading">The Election Process</h2>
      <p className="timeline-subtitle">Click on each step to learn more.</p>
      
      <div className="timeline">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`timeline-step ${activeStep === index ? 'active' : ''}`}
            onClick={() => handleStepClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            role="button"
            aria-expanded={activeStep === index}
            aria-controls={`step-details-${step.id}`}
          >
            <div className="step-icon">
              {step.icon}
            </div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              
              <div 
                className="step-details" 
                id={`step-details-${step.id}`}
                aria-hidden={activeStep !== index}
              >
                {step.details}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ElectionTimeline;
