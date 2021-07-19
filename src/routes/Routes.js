import React from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Formulario from '../pages/Formulario';
import Login from '../pages/Login';
import TablaSector from '../pages/TablaSector';

function Routes(){

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route exact path="/formulario" component={Formulario}/>
        <Route exact path="/tablaSector" component={TablaSector}/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
