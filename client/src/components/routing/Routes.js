import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Alert from '../layout/Alert'
import NotFound from '../layout/NotFound'
import PrivateRoute from './PrivateRoute'
import Login from '../auth/Login'
import Register from '../auth/Register'

const Routes = () => {
    return (
        <section className='container'>
            <Alert/>
            <Switch>
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
                <Route component={NotFound} />
            </Switch>
        </section>
    )
}

export default Routes;