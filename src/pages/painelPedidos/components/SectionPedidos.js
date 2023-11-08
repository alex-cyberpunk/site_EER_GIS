import React from 'react';

const SectionComponent = () => {
  return (
    <section style={{ color: '#ffffff', backgroundColor: '#00A6A3' }}>
      <div className="container">
        <div className="bs-row row">
          <div className="col-sm-12">
            <div className="spacer-card" style={{ height: '5px' }}></div>
          </div>
        </div>
        <div className="bs-row row">
          <div className="col-sm-12">
            <div className="markdown-card">
              <p style={{ textAlign: 'center', fontSize: '22px' }}>
              Coleta de propriedades no formato (.kmz) através de formulários, construindo um fluxo de aprovação de áreas. 
              </p>
            </div>
          </div>
        </div>
        <div className="bs-row row">
          <div className="col-sm-12">
            <div className="spacer-card" style={{ height: '5px' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionComponent;
