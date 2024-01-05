import React from 'react';
import './Steps.css'; // Certifique-se de que o arquivo CSS esteja no local correto

function StepProcess() {
  return (
    <div>
  <div className="markdown-card ember-view">
    <h1 style={{ textAlign: 'center' ,backgroundColor: '#ffffff', color: '#AC451E'  }}>Como funciona o fluxo de Aprovação e edição de Áreas</h1>
    <p style={{ textAlign: 'center' }}>
      O objetivo dessa ferramenta é criar um processo que garanta uma base de dados GIS segura, 
      interagindo com o usuário de maneira simples e prática.
    </p>
  </div>

  <div className="col-sm-12 ember-view">
    <div className="markdown-card ember-view">
      <ul className="steps-wrapper">
        <li>
          <div className="step-content">
            <h2>Inserção de Área</h2>
            <p>Adição de arquivo .kmz da propriedade desejada através de um formulário pelo setor Comercial Fundiário.</p>
          </div>
        </li>

        <li>
          <div className="step-content">
            <h2>Verificação de Justificativa</h2>
            <p>Em caso de área sem aprovação imediata, é necessária uma justificativa e análise pela equipe de Resources</p>
          </div>
        </li>

        <li>
          <div className="step-content">
            <h2>Aprovação Topográfica</h2>
            <p>Áreas solicitadas pela equipe de Recursos e pelo setor Comercial Fundiário passam por verificação topográfica e se aceitas ,são incluídas na base de dados.</p>
          </div>
        </li>
        <li>
          <div className="step-content">
            <h2>Edição de Áreas</h2>
            <p>Áreas já existentes na base de dados podem ser editadas pelo setor Comercial Fundiário com a aprovação da topografia.</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>

  );
}

export default StepProcess;
