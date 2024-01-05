import React from 'react';
import {queryByFieldValue,loadLayer} from '../../../featuresArcgisJS/Consultas.js'
import { replace } from 'dojo/dom-class';

class SummaryStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counts: []
    };
  }

  componentDidMount() {
    const { appManager, userApp } = this.props;
    Promise.all(Object.values(appManager.contagemPedidos).map(summary => 
      loadLayer(null, appManager.mapaPedidos.url, 0)
      .then(async (featureLayer) => {
        let replacedQuery = summary.whereClause.replace("{","'");
        replacedQuery = replacedQuery.replace("}","'");
        replacedQuery = replacedQuery.replace("user",userApp.userName);
        replacedQuery=replacedQuery.replace(/\"/g, "'");
        let result = await queryByFieldValue(featureLayer, replacedQuery);
        
        if(result)
          return result.length;
        else
          return 0;
      })
    ))
    .then(counts => this.setState({ counts }));
  }
    render() {
    const { appManager } = this.props;
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
        {Object.values(appManager.contagemPedidos).map((pedido, index) => (
          <div key={index} className="col-sm-4 ember-view">
            <div className="summary-statistic-card ember-view" style={{ position: 'relative' }}>
              <div className="ss-title-row text-center" title={pedido.Title}>
                <span className="ss-title">{pedido.Title}</span>
              </div>
              <hr className="ss-title-spacer" />
              <div className="text-center">
                <span className="ss-value" style={{ color: '#aN', fontSize: '60px' }}>{this.state.counts[index]}</span>
                <span className="ss-trail-label"></span>
              </div>
              <div className="text-center">
                <div className="trailingText"></div>
              </div>
            </div>
          </div>
        ))}
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
 