import React from 'react'
import '../css/navbar.css'
import {NavLink} from 'react-router-dom'

export const Navbar = () => {
    return (
        <ul className="navbarContainer">
            <li className="navbarItem">
                <NavLink to='/main/addBaby' className="navlink" activeClassName="active">
                    <i className="fas fa-baby"></i>
                    <span className="buttonLabel">Add Baby</span>
                </NavLink>
            </li>
            <li className="navbarItem">
                <NavLink exact to='/main' className="navlink" activeClassName="active">
                    <i className="fas fa-baby-carriage"></i>
                    <span className="buttonLabel">My Babies</span>
                </NavLink>
            </li>
            <li className="navbarItem">
                <NavLink to="/main/account" className="navlink" activeClassName="active">
                    <i className="fas fa-user-md"></i>
                    <span className="buttonLabel">Account</span>
                </NavLink>
            </li>
        </ul>
    )
}