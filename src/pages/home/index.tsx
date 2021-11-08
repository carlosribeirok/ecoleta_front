import React, { useEffect, useState, ChangeEvent } from 'react';
// import axios from 'axios';

import { FiLogIn, FiSearch } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.svg';
import api from '../../services/api';

const Home = () => {

    const buttonSearch = document.querySelector("#page-home main a")
    const form = document.querySelector("#form")    
    const close = document.querySelector("#form .header a")

    close?.addEventListener("click", () => {
        form?.classList.add("hide")
    });

    buttonSearch?.addEventListener("click", () => {
        form?.classList.remove("hide")
    });

    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        api.get('states').then(response => {
            setStates(response.data);
        });
    }, []);

    useEffect(() => {
        if(selectedState === '0'){
            return;
        }
        
    }, [selectedState]);

    function getStateCities(state_id: number) {
        api.get('cities', {
            params: { state_id }
        }).then(response => {
            setCities(response.data);
        });
    }

    function handleSelectState(event: ChangeEvent<HTMLSelectElement>){
        setSelectedState(event.target.value);
        getStateCities(parseInt(event.target.value));
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city =  event.target.value;
        setSelectedCity(city);

    }

    return (
        
       <body>
            <div className="fundo">
                <div id="page-home">
                <div className="content">
                    <header>
                        <img src={ logo } alt="Ecoleta"/>
                        <Link to="/create-point" id="link">
                            <span>
                                <FiLogIn id="porta"/>
                                <strong>Cadastre um ponto de coleta</strong>
                            </span>
                        </Link> 
                    </header>
                    
                    <main>
                            <h1>Seu marketplace de coleta de resíduos.</h1>
                            <p>Ajudamos as pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                        
                            <a href="#">
                                <span>
                                    <FiSearch />                    
                                </span>
                                <strong>Pesquisar pontos de coleta</strong>
                            </a>
                            
                    </main>              
                </div>                
            </div>
            
            <div id="form" className="hide">
                <fieldset>
                        <div id="modal">
                            <div className="conteudo">
                                <div className="header">
                                    <h1>Pontos de Coleta</h1>
                                        <a href="#">Fechar</a>
                                </div>
                                <form action="/search-point" method="GET">
                                    <div className="field-group">
                                        <div className="field">
                                            <label htmlFor="uf">Estado(UF)</label>
                                            <select 
                                                name="state_id" 
                                                id="uf" 
                                                value={selectedState}                                         
                                                onChange={handleSelectState}    
                                                required                    
                                            >
                                                <option disabled selected value="">Selecione uma UF</option>
                                                {states.map(state => (
                                                    <option key={`state-${state.id}`} value={state.id}>{state.uf}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="city">Cidade</label>
                                            <select 
                                                name="city_id" 
                                                id="city"
                                                value={selectedCity}
                                                onChange={handleSelectCity}
                                                required
                                            >

                                                <option disabled selected value="">Selecione uma Cidade</option>
                                                {cities && cities.map(city => (
                                                    <option key={`city-${city.id}`} value={city.id}>{city.name}</option>
                                                ))}
                                            </select>                                
                                        </div>
                                    </div>
                                    <button type="submit">Buscar ponto de Coleta</button>
                                </form>
                            </div>                      
                        </div>
                    </fieldset>                        
                </div> 
            </div>
        </body>
        
    );
}

export default Home;