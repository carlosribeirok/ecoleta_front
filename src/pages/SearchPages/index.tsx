import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiMail } from 'react-icons/fi'; 
import { FaWhatsapp } from 'react-icons/fa'; 
import api from '../../services/api';

import logo from '../../assets/logo.svg';
import './styles.css';


interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    city_id: number,
    email: string
    id: number,
    image: string,
    image_url: string,
    items: Array<any>,
    latitude: number,
    longitude: number,
    name: string,
    state_id: number,
    whatsapp: number
}

const Search = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const state_id = urlParams.get('state_id');
    const city_id = urlParams.get('city_id');
    const [points, setPoints] = useState<any[]>([]);
    const [cityName, setCityName] = useState<String>()
    
    function searchPoints() {
        let parametros: {state_id: String, city_id: String} = {state_id: '', city_id: ''};
        if(state_id)
            parametros['state_id'] = state_id;
        if(city_id){
            parametros['city_id'] = city_id;
        } else return;

        api.get('points', {
            params: parametros
        }).then(response => {
            setPoints(response.data.points);
            setCityName(response.data.city_name);
        });

    }

    useEffect(() => { 
        searchPoints()
    }, [])

    function handleLocalization(latitude: any, longitude: any){
            window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    }

    // -25.457711,-49.353762
    function handleWhatsapp(whatsapp: any){
            window.open(`https://api.whatsapp.com/send?phone=55${whatsapp}`);
    }

    function handleEmail(email: any){
        window.open(`mailto:${email}?Subject=Tenho%20interesse%20em%20descartar%20resíduos`)
    }

    return (
           
            <div id="page-search-results">
                <div className="content">
                    <header>                        
                            <img src={ logo } alt="Ecoleta"/>
                            <Link to="/" id="link">
                                <span>
                                    <FiArrowLeft id="voltar"/>    
                                    <strong>Voltar para Home</strong>
                                </span>
                            </Link>                                       
                    </header>   

                    <h4>
                        <div className="caps">
                            {points && points.length} {points && points.length > 1 ? 'pontos' : 'ponto'}&nbsp;
                        </div>
                            {points && points.length > 1 ? 'encontrados' : 'encontrado'} em {cityName}
                    </h4>

                    <main>
                        <div className="cards">
                            {points && points.map((point) => {
                                return <>
                                    <div className="card">
                                        <img src={point.image_url} alt=""/>
                                        <h1>{point.name}</h1>

                                        <a href="" className="map" onClick={() => handleLocalization(point.latitude, point.longitude)}>
                                            <span><FiMapPin /></span>
                                            ⠀Ver no Maps
                                        </a>    

                                        {point.items.map((item: any) => (
                                            <h3 className="items">{item.title}</h3>               
                                        ))}
                                            
                                        <div className="mailwhats">
                                            <a href="" className="email" onClick={() => handleEmail(point.email)}>
                                                <span><FiMail /></span>
                                                Email
                                            </a> 

                                            <a href="" className="whats" onClick={() => handleWhatsapp(point.whatsapp)}>
                                                <span><FaWhatsapp /></span>
                                                ⠀Whatsapp
                                            </a>
                                        </div>    
                                    </div>
                                </>                                  
                            })}
                        </div>                            
                    </main>   
                </div>
            </div>     
           
    )
}

export default Search;

