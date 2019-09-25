import React from 'react'

export const ModuleNavbar = (props) => {
    return (
        <ul className="smallNavbar">
            <li className="smallNavbarItem">
                <button className={props.activeComponent === "overview" ? "navButton active" : "navButton"} onClick={() => props.setComponentToRender("overview")}>
                    <i className="fas fa-baby-carriage"></i>
                    <span className="buttonLabel">Overview</span>
                </button>
            </li>
            <li className="smallNavbarItem">
                <button className={props.activeComponent === "weights" ? "navButton active" : "navButton"} onClick={() => props.setComponentToRender("weights")}>
                    <i className="fas fa-baby"></i>
                    <span className="buttonLabel">Weights</span>
                </button>
            </li>
            <li className="smallNavbarItem">
                <button className={props.activeComponent === "fluids" ? "navButton active" : "navButton"} onClick={() => props.setComponentToRender("fluids")}>
                    <i className="fas fa-baby-carriage"></i>
                    <span className="buttonLabel">Fluids</span>
                </button>
            </li>
            <li className="smallNavbarItem">
                <button className={props.activeComponent === "sugars" ? "navButton active" : "navButton"} onClick={() => props.setComponentToRender("sugars")}>
                    <i className="fas fa-user-md"></i>
                    <span className="buttonLabel">Sugars</span>
                </button>
            </li>
            <li className="smallNavbarItem">
                <button className={props.activeComponent === "bilitool" ? "navButton active" : "navButton"} onClick={() => props.setComponentToRender("bilitool")}>
                    <i className="fas fa-user-md"></i>
                    <span className="buttonLabel">Bilitool</span>
                </button>
            </li>
            <li className="smallNavbarItem">
                <button className={props.activeComponent === "bloodgas" ? "navButton active" : "navButton"} onClick={() => props.setComponentToRender("bloodgas")}>
                    <i className="fas fa-user-md"></i>
                    <span className="buttonLabel">Blood Gas</span>
                </button>
            </li>
        </ul>
    )
}