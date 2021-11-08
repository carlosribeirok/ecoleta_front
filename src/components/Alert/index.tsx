import React, { useCallback, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiX } from 'react-icons/fi'; 
import { Link, useHistory } from 'react-router-dom';
import './styles.css';

const Alert = (props: object) => {
    // const { tempo: integer } = props;
    function fechar(){

    }

    setTimeout(() => {
        fechar();
    }, 2000);

    return (
        <div id="modalc">
            <div className="contentc">
                <div className="checkc">
                    <FiCheckCircle />
                </div>
                <span>
                    <h1>Cadastro concluído!</h1>
                    <Link to="/" className="fecharc">
                        <FiX />
                    </Link>
                </span>
            </div>
        </div>
    )
}

export default Alert;