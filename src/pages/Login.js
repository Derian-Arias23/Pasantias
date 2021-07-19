import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import swal from 'sweetalert';
import '../css/Login.css';

const urlU = 'https://localhost:5001/api/Usuario/GetU/';
const cookies = new Cookies();

class Login extends Component{

    state= {
        form: {
            username: '',
            password: '',
            id_rol: ''
        }
    }

    mostrarAlerta=()=>{
        swal({
            title:"Datos correctos",
            text:`Bienvenido ${[this.state.form.username]}`,
            icon: "success",
            timer: "10000"
        });
    }

    mostrarAlertaX=()=>{
        swal({
            title:"Datos incorrectos",
            text:"El usuario o la contraseña no son correctos.",
            icon: "warning",
            button: "Regresar",
            timer: "10000"
        });
    }

    handleChange= async e=>{
        await this.setState({
         form: {
             ...this.state.form,
             [e.target.name]: e.target.value
         }   
        });
        console.log(this.state.form);
    }

    iniciarSession = async()=>{
        await axios.get(urlU+ this.state.form.username +'/'+ this.state.form.password)
        .then(response=>{
            return response.data;
        })
        .then(response => {
            if(response.length> 0){
                var respuesta = response[0];
                cookies.set('id_usua', respuesta.id_usua, {path: "/"});
                cookies.set('usua_nombre', respuesta.usua_nombre, {path: "/"});
                cookies.set('contraseña', respuesta.contraseña, {path: "/"});
                cookies.set('id_rol', respuesta.id_rol, {path: "/"});
                this.mostrarAlerta();
                window.location.href="./formulario";
                this.validarBtn();
            }else{
                this.mostrarAlertaX();
            }
        }).catch(error=>{
            console.log(error);
        })
    }

    componentDidMount=()=>{
        if(cookies.get('username')){
            window.location.href="./formulario";
        }
    }

    render(){
    return (
        <div className="containerPrincipal">
        <div className="containerLogin">
            <div className="form-group">
                <label>Usuario: </label>
                <input type="text" className="form-control" name="username" required onChange={this.handleChange}></input>
                <br></br> 
                <label>Contraseña: </label>
                <input type="password" className="form-control" name="password" required onChange={this.handleChange}></input>
                <br></br>
                <button className="btn btn-primary" onClick={()=> this.iniciarSession()}>Iniciar Sesión</button>
            </div>
        </div>
        </div>
        );
    }
}
export default Login;