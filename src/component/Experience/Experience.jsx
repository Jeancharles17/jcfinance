
import React from 'react';
import './experience.css';

const Experience = () => {
  return (
    <section id="experience">
      <h1>Experience & Education</h1>
      <div className="experience-container">

        <div className="education">
          <h2>Education</h2>
          <div className="education-item">
            <h3>Master of Computer Science</h3>
            <p>Full Sail University</p>
          </div>
        </div>

        <div className="work-experience">
          <h2>Work Experience</h2>
          
          <div className="job-item">
            <h3>Design Engineer/Project Manager</h3>
            <p>Enercon - Miami, FL (May 2023 - Current)</p>
            <ul>
              <li>Coordinated multiple project sites for distribution engineering.</li>
              <li>Ensured outreach team collected necessary information from customers.</li>
              <li>Developed innovative product designs using CAD software and industry standards.</li>
              <li>Successfully tested and validated products, collaborated with cross-functional teams, documented processes, and contributed to cost analysis and regulatory compliance initiatives.</li>
              <li>Ensured project milestones were met on time and within budget.</li>
            </ul>
          </div>

          <div className="job-item">
            <h3>Associate Software Engineer (Internship)</h3>
            <p>Cognixia - Orlando, FL (January 2023 - May 2023)</p>
            <ul>
              <li>Engaged in an internship to gain hands-on experience in software engineering.</li>
              <li>Worked on API development, front-end development, and database structuring.</li>
              <li>Utilized React and TypeScript for front-end development and user-end stories.</li>
              <li>Designed and managed databases using SQL and MongoDB.</li>
              <li>Delivered robust and user-friendly software solutions, improving system performance and enhancing user experience.</li>
            </ul>
          </div>

          <div className="job-item">
            <h3>Information System Specialist (Contract)</h3>
            <p>Abridge Info System Company - Miami, FL (June 2022 - January 2023)</p>
            <ul>
              <li>Managed and improved the company’s information systems.</li>
              <li>Responsible for system administration, data management, and user support.</li>
              <li>Implemented system upgrades, optimized database performance, and provided technical support to end-users.</li>
              <li>Improved system reliability and performance, reduced downtime, and enhanced user satisfaction through effective support and maintenance.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
