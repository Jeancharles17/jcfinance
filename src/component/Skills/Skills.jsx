import React from 'react'
import './skills.css'

const Skills = () => {
  return (
    <section id='skills'>
        <h1>Skills</h1>
        <div className='s-container'>
            <div className='s-box'>
                <div className='box'>
                    <span>Web Devlopement</span>
                    <div className='list'>
                        <li>React</li>
                        <li>MongoDB</li>
                        <li>React</li>

                    </div>

                </div>
                <div className='box'>
                    <span>Programming</span>
                    <div className='list'>
                        <li>Python</li>
                        <li>C++</li>
                        <li>C</li>

                    </div>

                </div>
                <div className='box'>
                    <span>Data Science</span>
                    <div className='list'>
                        <li>Python</li>
                        <li>SQL</li>
                        <li>Pandas</li>
                        <li>NumPy</li>
                    </div>

                </div>
                <div className='box'>
                    <span>Avaiation</span>
                    <div className='list'>
                        <li>Aerodynamics</li>
                        <li>Aircraft Systems</li>
                        <li>Situational Awareness</li>
                        <li>Communication</li>
                        <li>Physics</li>
                    </div>

                </div>
                
                


            </div>
            

        </div>
        
    </section>
  )
}

export default Skills