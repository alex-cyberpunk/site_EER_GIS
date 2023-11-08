import React from 'react';
import './Footer.css'; // Importe seu arquivo de estilos CSS


function Footer() {
  return (
    <div>
        <footer className="site-footer" style={{ color: '#ffffff', backgroundColor: '#65675E' }}>
      <div className="custom-footer">
        <div className="mirror-header-theme">
          <div className="container">
            <div className="col-sm-6">
              <table className="logo-title-alignment">
                <tbody>
                  <tr>
                    <td>
                      <img
                        alt="Engeform Energia Renovável"
                        height="100px"
                        src='/engeform.png' // Importe a imagem ou use require
                      />
                    </td>
                    <td className="title">
                    Engeform Energia Renovável<br />
                      GIS & Resources
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-sm-6 contact-info-alignment">
              <div>
                Desenvolvido por: Alex Matias
                <br />
                Contato para dúvidas
                <br />
                Email: <a href="mailto:alex.matias@pecenergia.com.br">alex.matias@pecenergia.com.br</a>
                <br />
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>

    </div>
    
  );
}

export default Footer;

