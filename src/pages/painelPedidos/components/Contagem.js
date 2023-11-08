import React from 'react';

function SummaryStatistics() {
  return (
    <section style={{ color: '#ffffff', backgroundColor: '#65675E' }} className="layout-section ember-view">
      <div className="container">
        <div className="bs-row row ember-view">
          <div className="col-sm-12 ember-view">
            <div className="ember-view">
              <div className="spacer-card" style={{ height: '10px' }}></div>
            </div>
          </div>
        </div>
        <div className="bs-row row ember-view">
          <div className="col-sm-4 ember-view">
            <div className="summary-statistic-card ember-view" style={{ position: 'relative' }}>
              <div className="ss-title-row text-center" title="Open Requests">
                <span className="ss-title">Em Analise pelo Resources</span>
              </div>
              <hr className="ss-title-spacer" />
              <div className="text-center">
                <span className="ss-value" style={{ color: '#aN', fontSize: '60px' }}>10</span>
                <span className="ss-trail-label"></span>
              </div>
              <div className="text-center">
                <div className="trailingText"></div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 ember-view">
            <div className="summary-statistic-card ember-view" style={{ position: 'relative' }}>
              <div className="ss-title-row text-center" title="Completed Requests">
                <span className="ss-title">Em Analise pela Topografia</span>
              </div>
              <hr className="ss-title-spacer" />
              <div className="text-center">
                <span className="ss-value" style={{ color: '#aN', fontSize: '60px' }}>20</span>
                <span className="ss-trail-label"></span>
              </div>
              <div className="text-center">
                <div className="trailingText"></div>
              </div>
            </div>
          </div>
                   
        </div>
        <div className="bs-row row ember-view">
          <div className="col-sm-12 ember-view">
            <div className="ember-view">
              <div className="spacer-card" style={{ height: '10px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SummaryStatistics;


/*
          <div className="col-sm-4 ember-view">
            <div className="summary-statistic-card ember-view" style={{ position: 'relative' }}>
              <div className="ss-title-row text-center" title="Customer Service (out of 5)">
                <span className="ss-title">Customer Service (out of 5)</span>
              </div>
              <hr className="ss-title-spacer" />
              <div className="text-center">
                <span className="ss-value" style={{ color: '#aN', fontSize: '60px' }}>3.45</span>
                <span className="ss-trail-label"></span>
              </div>
              <div className="text-center">
                <div className="trailingText"></div>
              </div>
            </div>
          </div>
          */
 