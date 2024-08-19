import React from 'react'
import './header.css'
import IMG from '../../assets/jc.jpg'

const Header = () => {
  return (
    <header>
        <div className='container '> 
            <div className='left'>
                <img src={IMG} alt="jc-img" />

            </div>
            <div className='right'>
                <a href="#home"> Home</a>
                <a href="#about"> About</a>
                <a href="#skills"> Skills</a>
                <a href="#projects"> Projects</a>
                <a href="#blog"> Blogs</a>
                <a href="#experience"> Experience</a>
                <a href="#contact"> Contact</a>

            </div>

        </div>
    </header>
  )
}

export default Header