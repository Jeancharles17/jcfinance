import React from 'react';
import './projects.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

// Import your project images
import Project1 from '../../assets/project1.jpeg';
import Project2 from '../../assets/project2.png';
import Project3 from '../../assets/project3.png';

const Projects = () => {
  return (
    <section id="projects">
      <h1>My Projects</h1>
      <div className="p-container">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}  // Pagination is configured here
          loop={true}
          className="swiper-container"
        >
          <SwiperSlide className="slide">
            <img src={Project1} alt="Project 1" />
            <h2>BetterBudget</h2>
            <p>Empower your financial planning with our AI-driven budgeting tool. By analyzing your spending habits and incorporating personalized feedback, our system helps you make smarter decisions, optimize your budget, and achieve your financial goals with ease.</p>
          </SwiperSlide>
          <SwiperSlide className="slide">
            <img src={Project2} alt="Project 2" />
            <h2>Face detection AI</h2>
            <p>Face AI leverages advanced artificial intelligence to analyze, recognize, and interpret facial features and expressions. It enables applications ranging from security and authentication to personalized user experiences, enhancing interactions through accurate facial recognition and emotion detection</p>
            <a href="https://github.com/Jeancharles17/facedetection" target="_blank" rel="noopener noreferrer">Link</a>
          </SwiperSlide>
          <SwiperSlide className="slide">
            <img src={Project3} alt="Project 3" />
            <h2>Car detection AI</h2>
            <p>Car Detection utilizes AI-powered computer vision to identify and track vehicles in real-time. This technology is widely used in traffic monitoring, autonomous driving, and security systems, providing accurate detection and analysis of cars in various environments.</p>
            <a href="https://github.com/Jeancharles17/cardetection" target="_blank" rel="noopener noreferrer">Link</a>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default Projects;


