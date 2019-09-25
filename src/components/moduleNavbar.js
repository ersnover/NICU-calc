import React from 'react'
import {NavLink} from 'react-router-dom'

export const ModuleNavbar = (props) => {
    return (
        <ul className="smallNavbar">
            <li className="smallNavbarItem">
                <NavLink exact to='/main/babyView/overview' className="navlink" activeClassName="active">
                    <i className="fas fa-baby-carriage"></i>
                    <span className="buttonLabel">Overview</span>
                </NavLink>
            </li>
            <li className="smallNavbarItem">
                <NavLink to='/main/babyView/weights' className="navlink" activeClassName="active">
                    <i className="fas fa-baby"></i>
                    <span className="buttonLabel">Weights</span>
                </NavLink>
            </li>
            <li className="smallNavbarItem">
                <NavLink exact to='/main/babyView/fluids' className="navlink" activeClassName="active">
                    <i className="fas fa-baby-carriage"></i>
                    <span className="buttonLabel">Fluids</span>
                </NavLink>
            </li>
            <li className="smallNavbarItem">
                <NavLink to="/main/babyView/sugars" className="navlink" activeClassName="active">
                    <i className="fas fa-user-md"></i>
                    <span className="buttonLabel">Sugars</span>
                </NavLink>
            </li>
            <li className="smallNavbarItem">
                <NavLink to="/main/babyView/bilitool" className="navlink" activeClassName="active">
                    <i className="fas fa-user-md"></i>
                    <span className="buttonLabel">Bilitool</span>
                </NavLink>
            </li>
            <li className="smallNavbarItem">
                <NavLink to="/main/babyView/bloodgas" className="navlink" activeClassName="active">
                    <i className="fas fa-user-md"></i>
                    <span className="buttonLabel">Blood Gas</span>
                </NavLink>
            </li>
        </ul>
    )
}