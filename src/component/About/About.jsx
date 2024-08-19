import React from 'react'
import './about.css'
import IMG from '../../assets/jc.jpg'

const About = () => {
  return (
    <section id='about'>
        <div className='aboutContainer'>
            <div className='about-left'>
                <img src={IMG} alt="" />

            </div>
            <div className='about-right'>
                <h2>About Me</h2>
                <p>
                My name is Jean Charles. I am currently pursuing a Master’s degree in Computer Science at Full Sail University and training to become a pilot. My passion for technology and aviation began in childhood, and I've always been fascinated by how science unites us, transcending opinions and bringing humanity together.

I specialize in software engineering, data science, machine learning, and flying. I thrive on working with data to solve complex problems and am driven by my dream of flying and developing advanced aviation software. My ultimate goal is to build innovative solutions that push the boundaries of what's possible in both technology and aviation.
                </p>

            </div>

        </div>

    </section>
  )
}

export default About