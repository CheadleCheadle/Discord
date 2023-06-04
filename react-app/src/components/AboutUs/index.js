import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import "./main.css";
export default function AboutUs() {
    return (
        <div id="about-us-container">
        <Link id="back" to="/servers">
            <FontAwesomeIcon icon={faArrowLeftLong} />
            Back
            </Link>

        <div className="about-us-cont">
        <div id="about-me-cont">
            <h1>Grant A. Cheadle</h1>
            <div className="about-info">
                <div className="grant pfp"></div>
            </div>
            <div className="about-info">
                <h3>About me</h3>
                <p>I specialize in front-end technologies, including React.js and Vue.js, and excel in programming languages such as Javascript, Python, and SQL. Currently, I am honing my expertise in React.js while delving into innovative languages like Rust and TypeScript to develop robust, scalable, and secure applications. Driven by a passion for delivering results, I am well-equipped to confront any challenge and make a significant impact within any team!</p>
            </div>


            <div className="about-info">
                <h3 id="details">Details</h3>
                <span>
                    <div id="externals">

                        <a id="linkedin" href="https://www.linkedin.com/in/grant-a-cheadle-0233771a7/" target="_blank">
                            <i class="fa-brands fa-linkedin"></i>
                        </a>

                        <a id="portfolio" href="https://cheadlecheadle.github.io/" target="_blank">Portfolio</a>

                        <a id="linkedin" href="https://github.com/CheadleCheadle" target="_blank">
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </span>

            </div>

        </div>
        <div id="about-me-cont">

            <h1>Chunyi (Helen) Koo</h1>
            <div className="about-info">
                <div className="helen pfp"></div>
            </div>
            <div className="about-info">
                <h3>About me</h3>
                <p>I'm Helen, a software developer with a degree in computer science from 2001. Since then, I've worked in various roles, including product engineering and NPI project manager at Foxconn, an international manufacturing company. Through my previous jobs, I have developed problem-solving skills, attention to detail, and the ability to work in a team.</p>
            </div>


            <div className="about-info">
                <h3 id="details">Details</h3>
                <span>
                    <div id="externals">

                        <a id="linkedin" href="https://www.linkedin.com/in/chunyi-koo-70780025a/" target="_blank">
                            <i class="fa-brands fa-linkedin"></i>
                        </a>

                        <a id="portfolio" href="https://chunyikoo.github.io/" target="_blank">Portfolio</a>

                        <a id="linkedin" href="https://github.com/ChunyiKoo" target="_blank">
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </span>

            </div>

        </div>

        <div id="about-me-cont">

            <h1>Tony Zheng</h1>
            <div className="about-info">
                <div className="tony pfp"></div>
            </div>
            <div className="about-info">
                <h3>About me</h3>
                <p>Goal-driven and adaptable professional with a passion for taking on challenges and delivering results. With an extensive background in Marketing and Communications, I bring unique perspectives and valuable experiences to any team.

Skilled in interpersonal communication and collaboration, I excel at connecting with people from various backgrounds and ideologies, fostering an inclusive and supportive environment for success.</p>
            </div>


            <div className="about-info">
                <h3 id="details">Details</h3>
                <span>
                    <div id="externals">

                        <a id="linkedin" href="https://www.linkedin.com/in/tony-zheng-577840156/" target="_blank">
                            <i class="fa-brands fa-linkedin"></i>
                        </a>

                        <a id="portfolio" href="https://usr1l.github.io/" target="_blank">Portfolio</a>
                        <a id="linkedin" href="https://github.com/usr1l" target="_blank">

                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </span>

            </div>

        </div>
        </div>
        </div>
    )
}
