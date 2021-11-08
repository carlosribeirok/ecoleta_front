import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; 
import { useMap, MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

const swal = require('@sweetalert/with-react');

const CreatePoint = () => {    

    const [items, setItems] = useState<Item[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        image:'',
        email: '',
        whatsapp: '',
    });

    const [center, setCenter] = useState({
        lat: -25.4321587,
        lng: -49.2796458,
      });
      
    const [markerPosition, setMarkerPosition] = useState(center);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setMarkerPosition({lat, lng});
            setCenter({lat, lng});
        });
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
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

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };
    
    function ChangeView(){
        const map = useMap();
        map.setView(center);
        useMapEvents({
            click(event) {
                setMarkerPosition(event.latlng);
                setCenter(event.latlng);
            }
        })
        return null;
    }
   
    function alertaSucesso() {
        return (
            swal({
                icon: "success",
                text: "Ponto cadastrado com sucesso!",
                timer: 2000,
                buttons: false,
                content: (
                  <div></div>
                )
              }).then(() => {
                  history.push('/');
              })
        )
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp } = formData
        const state = selectedState;
        const city = selectedCity;
        const latitude = markerPosition.lat.toFixed(4);
        const longitude = markerPosition.lng.toFixed(4);
        const items = selectedItems;

        const data = new FormData()

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('state_id', state);
        data.append('city_id', city);
        data.append('latitude', latitude);
        data.append('longitude', longitude);
        data.append('items', items.join(','));

        if (selectedFile) {
            data.append('image', selectedFile)
        }

        await api.post('points', data);

        alertaSucesso();

    };

    return (
        <body>            
            <div className="fundo">   
                <div id="page-create-point">
                    <header>
                        <img src={ logo } alt="Ecoleta"/>
                        <Link to="/" id="voltar">
                            <p>
                                <FiArrowLeft />    
                                Voltar para Home
                            </p>
                        </Link>
                    </header>
                    
                    <form onSubmit={handleSubmit}> 
                        <h1>Cadastro do <br/> ponto de coleta</h1>

                        <Dropzone onFileUploaded={setSelectedFile}/>

                        <fieldset>
                            <legend>
                                <h2>Dados da Organização</h2>
                            </legend>

                            <div className="field-group">
                                <div className="field">
                                    <label htmlFor="name">Nome da entidade</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        id="name"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>                

                            </div>
                            
                            <div className="field-group">
                                <div className="field">
                                    <label htmlFor="email">E-mail</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        placeholder="Seu email @domínio.com"
                                        onChange={handleInputChange}
                                    />  
                                </div>
                                <div className="field">
                                    <label htmlFor="whatsapp">Whatsapp</label>
                                    <input 
                                        type="text"
                                        name="whatsapp"
                                        id="whatsapp"
                                        required
                                        placeholder="(11) 8888-9999"
                                        onChange={handleInputChange}
                                    />  
                                </div>                                                          
                            </div>

                        </fieldset>

                        <fieldset>
                            <legend>
                                <h2>Endereço</h2>
                                <span>Arraste o marcador ou clique no mapa</span>                    
                            </legend>

                            <MapContainer center={center} zoom={14} scrollWheelZoom={false} >
                                <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <ChangeView /> 
                                <Marker draggable={true} eventHandlers={{
                                    dragend: (event) => {
                                        setMarkerPosition(event.target.getLatLng());
                                        setCenter(event.target.getLatLng());
                                    },
                                    }}
                                position={markerPosition} />
                            </MapContainer>

                            <div className="field-group">
                                <div className="field">
                                    <label htmlFor="uf">Estado(UF)</label>
                                    <select 
                                        name="uf" 
                                        id="uf" 
                                        required
                                        value={selectedState} 
                                        onChange={handleSelectState}
                                        
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
                                        name="city" 
                                        id="city"
                                        required
                                        value={selectedCity}
                                        onChange={handleSelectCity}

                                    >

                                        <option disabled selected value="">Selecione uma Cidade</option>
                                        {cities && cities.map(city => (
                                            <option key={`city-${city.id}`} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>
                                <h2>Ítens de coleta</h2>
                                <span>Selecione um ou mais ítens de coleta</span>
                            </legend>
                            <ul className="items-grid">
                                {items.map(item => (
                                    <li 
                                        key={item.id} 
                                        onClick={() => handleSelectItem(item.id)}
                                        className={selectedItems.includes(item.id) ? 'selected' : ''}
                                    >
                                        <img src={item.image_url} alt={item.title} />    
                                        <span>{item.title}</span>                        
                                    </li>
                                ))}
                            </ul>
                        </fieldset>
                        
                        <button type="submit">
                            Cadastrar ponto de coleta
                        </button>
                
                    </form>
                </div>            
            </div>
        </body>
    );
};

export default CreatePoint;

